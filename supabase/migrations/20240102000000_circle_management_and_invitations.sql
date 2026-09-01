-- ==============================================================================
-- ANAMNESIS MIGRATION: GESTIÓN DE CÍRCULOS, MIEMBROS E INVITACIONES
-- ==============================================================================

-- 1. Tipo Enum para estado de invitación
DO $$ BEGIN
    CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'revoked', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tabla de Invitaciones a Círculos
CREATE TABLE IF NOT EXISTS public.circle_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role circle_member_role NOT NULL DEFAULT 'member',
    invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
    status invitation_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (timezone('utc'::text, now()) + interval '7 days')
);

-- 3. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_circle_invitations_circle ON public.circle_invitations(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_invitations_email ON public.circle_invitations(email);
CREATE INDEX IF NOT EXISTS idx_circle_invitations_token ON public.circle_invitations(token);

-- ==============================================================================
-- RLS POLICIES PARA GESTIÓN DE MIEMBROS E INVITACIONES
-- ==============================================================================

ALTER TABLE public.circle_invitations ENABLE ROW LEVEL SECURITY;

-- 1. Políticas de circle_invitations
DROP POLICY IF EXISTS "Editores y administradores pueden ver invitaciones de su círculo" ON public.circle_invitations;
CREATE POLICY "Editores y administradores pueden ver invitaciones de su círculo"
    ON public.circle_invitations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.circles c
            WHERE c.id = circle_id AND c.editor_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.circle_members cm
            WHERE cm.circle_id = circle_id AND cm.user_id = auth.uid() AND cm.role = 'admin'
        )
        OR email = (SELECT p.email FROM public.profiles p WHERE p.id = auth.uid())
    );

DROP POLICY IF EXISTS "Solo el editor_id o admin puede crear invitaciones" ON public.circle_invitations;
CREATE POLICY "Solo el editor_id o admin puede crear invitaciones"
    ON public.circle_invitations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.circles c
            WHERE c.id = circle_id AND c.editor_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.circle_members cm
            WHERE cm.circle_id = circle_id AND cm.user_id = auth.uid() AND cm.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Editor o admin puede revocar invitaciones" ON public.circle_invitations;
CREATE POLICY "Editor o admin puede revocar invitaciones"
    ON public.circle_invitations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.circles c
            WHERE c.id = circle_id AND c.editor_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.circle_members cm
            WHERE cm.circle_id = circle_id AND cm.user_id = auth.uid() AND cm.role = 'admin'
        )
    );

-- 2. Refuerzo de políticas en circle_members para modificación de roles y revocación de acceso
DROP POLICY IF EXISTS "Solo el editor_id o admin puede actualizar roles de miembros" ON public.circle_members;
CREATE POLICY "Solo el editor_id o admin puede actualizar roles de miembros"
    ON public.circle_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.circles c
            WHERE c.id = circle_id AND c.editor_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.circle_members cm
            WHERE cm.circle_id = circle_id AND cm.user_id = auth.uid() AND cm.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Editor o admin puede revocar miembros y usuarios pueden salir" ON public.circle_members;
CREATE POLICY "Editor o admin puede revocar miembros y usuarios pueden salir"
    ON public.circle_members FOR DELETE
    USING (
        auth.uid() = user_id -- El propio usuario decide salir
        OR EXISTS (
            SELECT 1 FROM public.circles c
            WHERE c.id = circle_id AND c.editor_id = auth.uid() -- Editor revoca acceso
        )
        OR EXISTS (
            SELECT 1 FROM public.circle_members cm
            WHERE cm.circle_id = circle_id AND cm.user_id = auth.uid() AND cm.role = 'admin'
        )
    );
