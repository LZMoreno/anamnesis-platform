-- ==============================================================================
-- ANAMNESIS DATABASE SCHEMA - ATOMIC 30-MIN BOOKING SYSTEM & RACE CONDITION PROTECTION
-- ==============================================================================

-- 1. Añadir columna article_id a bookings si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'article_id'
    ) THEN
        ALTER TABLE public.bookings 
        ADD COLUMN article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bookings_article ON public.bookings(article_id);

-- 2. Transacción Atómica con Bloqueo Explícito (SELECT ... FOR UPDATE)
-- Previene Race Conditions y reservas dobles concurrentes
CREATE OR REPLACE FUNCTION public.book_slot_atomic(
    p_slot_id UUID,
    p_reader_id UUID,
    p_article_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_slot RECORD;
    v_booking_id UUID;
BEGIN
    -- Bloqueo explícito de la fila para evitar que dos transacciones concurrentes lean is_booked = false al mismo tiempo
    SELECT * INTO v_slot
    FROM public.availability_slots
    WHERE id = p_slot_id
    FOR UPDATE;

    -- Verificar existencia del slot
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'SLOT_NOT_FOUND',
            'message', 'El horario solicitado no existe o ya no está disponible.'
        );
    END IF;

    -- Verificar si ya fue reservado
    IF v_slot.is_booked THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'ALREADY_BOOKED',
            'message', 'Este espacio acaba de ser reservado por otro lector. Por favor, selecciona otro horario disponible.'
        );
    END IF;

    -- Marcar el slot como reservado atómicamente
    UPDATE public.availability_slots
    SET is_booked = true
    WHERE id = p_slot_id;

    -- Insertar la reserva confirmada
    INSERT INTO public.bookings (slot_id, reader_id, article_id, status, notes)
    VALUES (p_slot_id, p_reader_id, p_article_id, 'confirmed', p_notes)
    RETURNING id INTO v_booking_id;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'slot_id', p_slot_id,
        'message', '¡Sesión de 30 minutos confirmada exitosamente!'
    );
END;
$$;

-- 3. Transacción Atómica de Cancelación con Regla de 2 Horas de Anticipación
CREATE OR REPLACE FUNCTION public.cancel_booking_atomic(
    p_booking_id UUID,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_booking RECORD;
    v_diff_hours NUMERIC;
BEGIN
    -- Bloquear la reserva y el slot asociado
    SELECT b.*, s.start_time, s.author_id, s.id AS slot_id
    INTO v_booking
    FROM public.bookings b
    JOIN public.availability_slots s ON s.id = b.slot_id
    WHERE b.id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'BOOKING_NOT_FOUND',
            'message', 'La reserva no existe.'
        );
    END IF;

    -- Verificar permisos: solo el lector o el autor de la sesión pueden cancelarla
    IF v_booking.reader_id != p_user_id AND v_booking.author_id != p_user_id THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'UNAUTHORIZED',
            'message', 'No tienes autorización para cancelar esta sesión.'
        );
    END IF;

    -- Comprobar si ya está cancelada
    IF v_booking.status = 'cancelled' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'ALREADY_CANCELLED',
            'message', 'Esta sesión ya se encuentra cancelada.'
        );
    END IF;

    -- Regla de Cancelación: Mínimo 2 horas de anticipación
    v_diff_hours := EXTRACT(EPOCH FROM (v_booking.start_time - now())) / 3600;
    IF v_diff_hours < 2 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'CANCELLATION_DEADLINE_PASSED',
            'message', 'Las cancelaciones solo se permiten con un mínimo de 2 horas de anticipación al inicio de la sesión.'
        );
    END IF;

    -- Actualizar estado de la reserva a 'cancelled'
    UPDATE public.bookings
    SET status = 'cancelled'
    WHERE id = p_booking_id;

    -- Liberar el slot de disponibilidad para que otros lectores puedan reservarlo
    UPDATE public.availability_slots
    SET is_booked = false
    WHERE id = v_booking.slot_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'La sesión ha sido cancelada exitosamente y el horario se ha liberado.'
    );
END;
$$;
