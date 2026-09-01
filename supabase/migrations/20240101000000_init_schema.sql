-- ==============================================================================
-- ANAMNESIS DATABASE SCHEMA - SUPABASE MIGRATION
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tipos y Enums personalizados
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('reader', 'author', 'editor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE circle_member_role AS ENUM ('member', 'moderator', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Tabla: profiles (Perfiles vinculados a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'reader',
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Tabla: circles (Círculos editoriales y temáticos)
CREATE TABLE IF NOT EXISTS public.circles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_url TEXT,
    editor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Tabla: circle_members (Miembros y suscriptores de círculos)
CREATE TABLE IF NOT EXISTS public.circle_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role circle_member_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(circle_id, user_id)
);

-- 6. Tabla: articles (Artículos, crónicas y ensayos)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{"type": "doc", "content": []}'::jsonb,
    excerpt TEXT NOT NULL,
    cover_url TEXT,
    status article_status NOT NULL DEFAULT 'draft',
    tags TEXT[] NOT NULL DEFAULT '{}',
    reading_time_min INT NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(circle_id, slug)
);

-- 7. Tabla: comments (Comentarios con soporte de hilos anidados)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Tabla: bookmarks (Artículos guardados por lectores)
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, article_id)
);

-- 9. Tabla: availability_slots (Bloques de agendamiento y asesoría para autores)
CREATE TABLE IF NOT EXISTS public.availability_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT valid_slot_time CHECK (end_time > start_time)
);

-- 10. Tabla: bookings (Reservas de mentorías o asesorías de lectores con autores)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_id UUID NOT NULL REFERENCES public.availability_slots(id) ON DELETE CASCADE,
    reader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status booking_status NOT NULL DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ÍNDICES DE RENDIMIENTO
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_circles_slug ON public.circles(slug);
CREATE INDEX IF NOT EXISTS idx_circle_members_user ON public.circle_members(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_circle ON public.circle_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_articles_circle_status ON public.articles(circle_id, status);
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_comments_article ON public.comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_availability_slots_author_time ON public.availability_slots(author_id, start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_reader ON public.bookings(reader_id);

-- ==============================================================================
-- FUNCIONES Y TRIGGERS AUTOMÁTICOS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_circles_modtime ON public.circles;
CREATE TRIGGER update_circles_modtime
    BEFORE UPDATE ON public.circles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_articles_modtime ON public.articles;
CREATE TRIGGER update_articles_modtime
    BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_comments_modtime ON public.comments;
CREATE TRIGGER update_comments_modtime
    BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'reader'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_booking()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.availability_slots
    SET is_booked = true
    WHERE id = NEW.slot_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_booking_created ON public.bookings;
CREATE TRIGGER on_booking_created
    AFTER INSERT ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_booking();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 1. Políticas de Profiles
DROP POLICY IF EXISTS "Perfiles públicos legibles por todos" ON public.profiles;
CREATE POLICY "Perfiles públicos legibles por todos"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.profiles;
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. Políticas de Circles
DROP POLICY IF EXISTS "Círculos públicos legibles por todos" ON public.circles;
CREATE POLICY "Círculos públicos legibles por todos"
    ON public.circles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Editores pueden crear círculos" ON public.circles;
CREATE POLICY "Editores pueden crear círculos"
    ON public.circles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'editor'
        )
    );

DROP POLICY IF EXISTS "Editor del círculo puede actualizar su círculo" ON public.circles;
CREATE POLICY "Editor del círculo puede actualizar su círculo"
    ON public.circles FOR UPDATE
    USING (editor_id = auth.uid());

-- 3. Políticas de Circle Members
DROP POLICY IF EXISTS "Membresías legibles por todos" ON public.circle_members;
CREATE POLICY "Membresías legibles por todos"
    ON public.circle_members FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Usuarios pueden unirse a círculos" ON public.circle_members;
CREATE POLICY "Usuarios pueden unirse a círculos"
    ON public.circle_members FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden dejar círculos" ON public.circle_members;
CREATE POLICY "Usuarios pueden dejar círculos"
    ON public.circle_members FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Políticas de Articles
DROP POLICY IF EXISTS "Artículos publicados legibles por cualquiera" ON public.articles;
CREATE POLICY "Artículos publicados legibles por cualquiera"
    ON public.articles FOR SELECT
    USING (
        status = 'published'
        OR author_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.circles c
            WHERE c.id = circle_id AND c.editor_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Autores y Editores pueden crear artículos" ON public.articles;
CREATE POLICY "Autores y Editores pueden crear artículos"
    ON public.articles FOR INSERT
    WITH CHECK (
        auth.uid() = author_id
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('author', 'editor')
        )
    );

DROP POLICY IF EXISTS "Autores pueden editar sus artículos y editores los de su círculo" ON public.articles;
CREATE POLICY "Autores pueden editar sus artículos y editores los de su círculo"
    ON public.articles FOR UPDATE
    USING (
        author_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.circles c
            WHERE c.id = circle_id AND c.editor_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Autores o Editores pueden eliminar sus artículos" ON public.articles;
CREATE POLICY "Autores o Editores pueden eliminar sus artículos"
    ON public.articles FOR DELETE
    USING (
        author_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.circles c
            WHERE c.id = circle_id AND c.editor_id = auth.uid()
        )
    );

-- 5. Políticas de Comments
DROP POLICY IF EXISTS "Comentarios públicos no ocultos legibles por todos" ON public.comments;
CREATE POLICY "Comentarios públicos no ocultos legibles por todos"
    ON public.comments FOR SELECT
    USING (is_hidden = false OR user_id = auth.uid());

DROP POLICY IF EXISTS "Usuarios autenticados pueden comentar" ON public.comments;
CREATE POLICY "Usuarios autenticados pueden comentar"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Autores de comentarios pueden editarlos" ON public.comments;
CREATE POLICY "Autores de comentarios pueden editarlos"
    ON public.comments FOR UPDATE
    USING (auth.uid() = user_id);

-- 6. Políticas de Bookmarks
DROP POLICY IF EXISTS "Usuarios pueden ver solo sus propios marcadores" ON public.bookmarks;
CREATE POLICY "Usuarios pueden ver solo sus propios marcadores"
    ON public.bookmarks FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden crear sus propios marcadores" ON public.bookmarks;
CREATE POLICY "Usuarios pueden crear sus propios marcadores"
    ON public.bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden eliminar sus marcadores" ON public.bookmarks;
CREATE POLICY "Usuarios pueden eliminar sus marcadores"
    ON public.bookmarks FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Políticas de Availability Slots
DROP POLICY IF EXISTS "Slots disponibles legibles por todos" ON public.availability_slots;
CREATE POLICY "Slots disponibles legibles por todos"
    ON public.availability_slots FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Autores gestionan sus propios slots" ON public.availability_slots;
CREATE POLICY "Autores gestionan sus propios slots"
    ON public.availability_slots FOR ALL
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- 8. Políticas de Bookings
DROP POLICY IF EXISTS "Lectores ven sus reservas y autores ven reservas de sus slots" ON public.bookings;
CREATE POLICY "Lectores ven sus reservas y autores ven reservas de sus slots"
    ON public.bookings FOR SELECT
    USING (
        reader_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.availability_slots s
            WHERE s.id = slot_id AND s.author_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Lectores autenticados pueden reservar slots disponibles" ON public.bookings;
CREATE POLICY "Lectores autenticados pueden reservar slots disponibles"
    ON public.bookings FOR INSERT
    WITH CHECK (
        auth.uid() = reader_id
        AND EXISTS (
            SELECT 1 FROM public.availability_slots s
            WHERE s.id = slot_id AND s.is_booked = false
        )
    );
