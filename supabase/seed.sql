-- ==============================================================================
-- ANAMNESIS DATABASE SEED DATA (Español realista, sin Lorem Ipsum)
-- ==============================================================================

-- UUIDs Fijos para referencias consistentes
-- Lector: aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa (lector@anamnesis.com)
-- Autor:  bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb (autor@anamnesis.com)
-- Editor: cccccccc-3333-4333-c333-cccccccccccc (editor@anamnesis.com)

-- 1. Insertar Usuarios en auth.users
-- Contraseña para los 3 usuarios: Password123! (hash bcrypt / argon2 standard de supabase)
-- Generado con: pgcrypto crypt('Password123!', gen_salt('bf'))
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES 
(
    'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'lector@anamnesis.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sofía Valenzuela", "role": "reader", "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}',
    now(),
    now()
),
(
    'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'autor@anamnesis.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Dr. Julián Sotomayor", "role": "author", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}',
    now(),
    now()
),
(
    'cccccccc-3333-4333-c333-cccccccccccc',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'editor@anamnesis.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Elena Rocafuerte", "role": "editor", "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"}',
    now(),
    now()
)
ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- 2. Insertar Perfiles (public.profiles)
INSERT INTO public.profiles (id, email, full_name, bio, avatar_url, role, timezone)
VALUES 
(
    'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
    'lector@anamnesis.com',
    'Sofía Valenzuela',
    'Estudiante de literatura comparada y apasionada por las narrativas urbanas y la bioética contemporánea.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'reader',
    'America/Mexico_City'
),
(
    'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    'autor@anamnesis.com',
    'Dr. Julián Sotomayor',
    'Médico internista en hospital universitario y ensayista. Explora la intersección entre el diagnóstico clínico, el dolor humano y la memoria.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'author',
    'America/Bogota'
),
(
    'cccccccc-3333-4333-c333-cccccccccccc',
    'editor@anamnesis.com',
    'Elena Rocafuerte',
    'Crítica literaria y editora en jefe de Anamnesis. Curadora de voces emergentes en no-ficción y ensayo hispanoamericano.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    'editor',
    'America/Argentina/Buenos_Aires'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    bio = EXCLUDED.bio,
    avatar_url = EXCLUDED.avatar_url,
    role = EXCLUDED.role;

-- 3. Insertar Círculos
INSERT INTO public.circles (id, name, slug, description, cover_url, editor_id)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Reseña Literaria',
    'resena-literaria',
    'Análisis riguroso, crítica de novedades editoriales y relecturas de obras canónicas hispanoamericanas bajo la mirada contemporánea.',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80',
    'cccccccc-3333-4333-c333-cccccccccccc'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Crónica',
    'cronica',
    'Relatos de no-ficción, periodismo narrativo, cartografías de la memoria urbana y testimonios de la vida cotidiana en América Latina.',
    'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=1200&auto=format&fit=crop&q=80',
    'cccccccc-3333-4333-c333-cccccccccccc'
),
(
    '33333333-3333-3333-3333-333333333333',
    'Ensayo Médico',
    'ensayo-medico',
    'Reflexiones clínicas, fenomenología del cuerpo enfermo, dilemas de bioética y la anamnesis como puente entre ciencia y humanismo.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    'cccccccc-3333-4333-c333-cccccccccccc'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Miembros de Círculos
INSERT INTO public.circle_members (circle_id, user_id, role)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'cccccccc-3333-4333-c333-cccccccccccc', 'admin'),
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa', 'member'),
    ('22222222-2222-2222-2222-222222222222', 'cccccccc-3333-4333-c333-cccccccccccc', 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb', 'moderator'),
    ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa', 'member'),
    ('33333333-3333-3333-3333-333333333333', 'cccccccc-3333-4333-c333-cccccccccccc', 'admin'),
    ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb', 'moderator')
ON CONFLICT (circle_id, user_id) DO NOTHING;

-- 5. Insertar Artículos (Con contenido extenso y realista en español)
INSERT INTO public.articles (
    id,
    circle_id,
    author_id,
    title,
    slug,
    content,
    excerpt,
    cover_url,
    status,
    tags,
    reading_time_min,
    created_at
) VALUES
(
    '44444444-4444-4444-4444-444444444441',
    '33333333-3333-3333-3333-333333333333',
    'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    'El peso de la palabra no dicha: Apuntes sobre la anamnesis en urgencias',
    'el-peso-de-la-palabra-no-dicha',
    '{"type": "doc", "content": [
        {"type": "paragraph", "text": "En la guardia nocturna, el silencio de un paciente suele ser más elocuente que cualquier estudio tomográfico. La medicina moderna nos ha adiestrado para confiar ciegamente en el biomarcador y la imagen por resonancia, relegando la conversación clínica a un formulario burocrático de quince minutos."},
        {"type": "paragraph", "text": "Sin embargo, el término anamnesis proviene del griego ἀνάμνησις: rememoración, traer al presente lo que parecía olvidado. Cuando un enfermo cruza el umbral de urgencias con dolor torácico opresivo, su cuerpo narra una crisis biológica, pero su mirada casi siempre formula otra pregunta: ¿quién me sostendrá si esto no pasa?"},
        {"type": "paragraph", "text": "Recuerdo a don Mateo, un relojero de setenta y cuatro años con disnea progresiva. Sus gases arteriales eran limpios; su ecocardiograma mostraba apenas la rigidez propia de las décadas. No fue hasta que le pregunté por su taller que brotó la verdadera causa de su asfixia: hacía tres semanas había tenido que vender su última lupa de precisión para costear la pensión. El corazón humano no distingue entre la hipoxia tisular y el luto por el oficio perdido."},
        {"type": "paragraph", "text": "Recuperar la escucha en el acto médico no es un capricho poético; es la forma más rigurosa de diagnóstico que conocemos."}
    ]}'::jsonb,
    'Una reflexión sobre cómo la prisa hospitalaria amenaza con eclipsar el arte de la escucha clínica en la sala de urgencias.',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
    'published',
    ARRAY['Medicina Narrativa', 'Bioética', 'Guardias Clínicas', 'Humanismo'],
    7,
    now() - interval '3 days'
),
(
    '44444444-4444-4444-4444-444444444442',
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    'Madrugadas en el tranvía fantasma: Los últimos maquinistas de la estación sur',
    'madrugadas-en-el-tranvia-fantasma',
    '{"type": "doc", "content": [
        {"type": "paragraph", "text": "A las cuatro y cuarto de la madrugada, los rieles de la terminal sur emiten un chirrido metálico que parece venir de otro siglo. En la cabina número doce, Carlos limpia el parabrisas empañado con la manga de su chaqueta de pana. Lleva treinta y dos años recorriendo la misma vía de diecisiete kilómetros entre los galpones industriales y el mercado de abastos."},
        {"type": "paragraph", "text": "La ciudad duerme bajo una neblina densa que amortigua el ruido de los motores. Quienes viajan a esta hora no conversan: panaderos con harina en las cejas, enfermeras con ojos vidriosos y cargadores de pescado que descansan la frente contra los cristales fríos."},
        {"type": "paragraph", "text": "El tranvía funciona como una cámara de descompresión entre la noche clandestina y el día laboral. Para Carlos, el tablero de controles ya no requiere vista; sus manos reconocen cada palanca como un pianista reconoce un arpegio sin mirar las teclas."},
        {"type": "paragraph", "text": "Cuando el sistema eléctrico sea reemplazado el próximo año por convoyes automáticos, nadie sabrá cómo frenar suavemente en la curva de los sauces para no despertar a los que sueñan de pie."}
    ]}'::jsonb,
    'Crónica sobre los trabajadores de la noche que sostienen el pulso de la ciudad antes del primer rayo de sol.',
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1200&auto=format&fit=crop&q=80',
    'published',
    ARRAY['Crónica Urbana', 'Memoria', 'Oficios Perdidos', 'Ciudad'],
    9,
    now() - interval '5 days'
),
(
    '44444444-4444-4444-4444-444444444443',
    '11111111-1111-1111-1111-111111111111',
    'cccccccc-3333-4333-c333-cccccccccccc',
    'La sintaxis del duelo en la narrativa de María Luisa Bombal',
    'la-sintaxis-del-duelo-maria-luisa-bombal',
    '{"type": "doc", "content": [
        {"type": "paragraph", "text": "En La amortajada (1938), María Luisa Bombal no solo concibe una de las aperturas más fulgurantes de la literatura latinoamericana; instaura una fenomenología sensorial de la muerte donde la difunta observa, escucha y juzga con una lucidez vedada a los vivos."},
        {"type": "paragraph", "text": "La prosa de Bombal prescinde del artificio melodramático para concentrarse en la temperatura de las cosas: la humedad de la tierra, el aroma denso de las coronas fúnebres, la textura de la seda que envuelve los brazos inmóviles."},
        {"type": "paragraph", "text": "Al releer su obra en este siglo vertiginoso, resalta su maestría para ralentizar el tiempo hasta convertir cada frase en un suspiro contenido. Bombal entendió antes que nadie que el dolor femenino en la literatura no requería histeria, sino una implacable precisión verbal."}
    ]}'::jsonb,
    'Una relectura crítica de La amortajada y la persistencia de una voz que desafió las convenciones del realismo.',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
    'published',
    ARRAY['Crítica Literaria', 'Narrativa Chilena', 'Siglo XX', 'Estética'],
    6,
    now() - interval '8 days'
),
(
    '44444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333333',
    'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    'Borrador: La anatomía del error médico y el tabú hospitalario',
    'anatomia-del-error-medico',
    '{"type": "doc", "content": [
        {"type": "paragraph", "text": "[BORRADOR CONFIDENCIAL EN REVISIÓN] Todo cirujano lleva dentro de sí un pequeño cementerio al que acude a orar en momentos de duda. El problema de los comités de morbimortalidad es que solemos buscar culpables administrativos en lugar de desmenuzar la fatiga cognitiva..."}
    ]}'::jsonb,
    'Manuscrito inédito en proceso de edición y revisión por pares sobre la cultura del silencio clínico.',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=1200&auto=format&fit=crop&q=80',
    'draft',
    ARRAY['Borrador', 'Bioética', 'Clínica'],
    5,
    now() - interval '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar Comentarios Anidados
-- Comentario Raíz
INSERT INTO public.comments (id, article_id, user_id, parent_id, content, is_hidden, created_at)
VALUES (
    '55555555-5555-5555-5555-555555555551',
    '44444444-4444-4444-4444-444444444441',
    'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
    NULL,
    'Este ensayo toca una fibra muy profunda. Me recordó una cita de Rita Charon sobre cómo la medicina narrativa no reemplaza la bioquímica, sino que le devuelve su propósito.',
    false,
    now() - interval '2 days'
) ON CONFLICT (id) DO NOTHING;

-- Respuesta Anidada del Autor
INSERT INTO public.comments (id, article_id, user_id, parent_id, content, is_hidden, created_at)
VALUES (
    '55555555-5555-5555-5555-555555555552',
    '44444444-4444-4444-4444-444444444441',
    'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    '55555555-5555-5555-5555-555555555551',
    '¡Exactamente, Sofía! Charon dio en el clavo. Sin el relato del paciente, el diagnóstico se vuelve pura estadística desprovista de sentido existencial.',
    false,
    now() - interval '1 day'
) ON CONFLICT (id) DO NOTHING;

-- 7. Insertar Marcadores (Bookmarks)
INSERT INTO public.bookmarks (user_id, article_id)
VALUES 
    ('aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444441'),
    ('aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444443')
ON CONFLICT (user_id, article_id) DO NOTHING;

-- 8. Insertar Slots de Disponibilidad para el Autor
INSERT INTO public.availability_slots (id, author_id, start_time, end_time, is_booked)
VALUES
(
    '66666666-6666-6666-6666-666666666661',
    'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    (CURRENT_DATE + interval '2 days' + time '16:00:00') AT TIME ZONE 'UTC',
    (CURRENT_DATE + interval '2 days' + time '17:00:00') AT TIME ZONE 'UTC',
    true
),
(
    '66666666-6666-6666-6666-666666666662',
    'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    (CURRENT_DATE + interval '3 days' + time '10:00:00') AT TIME ZONE 'UTC',
    (CURRENT_DATE + interval '3 days' + time '11:00:00') AT TIME ZONE 'UTC',
    false
),
(
    '66666666-6666-6666-6666-666666666663',
    'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    (CURRENT_DATE + interval '4 days' + time '15:00:00') AT TIME ZONE 'UTC',
    (CURRENT_DATE + interval '4 days' + time '16:00:00') AT TIME ZONE 'UTC',
    false
),
(
    '66666666-6666-6666-6666-666666666664',
    'cccccccc-3333-4333-c333-cccccccccccc',
    (CURRENT_DATE + interval '5 days' + time '17:00:00') AT TIME ZONE 'UTC',
    (CURRENT_DATE + interval '5 days' + time '18:00:00') AT TIME ZONE 'UTC',
    false
)
ON CONFLICT (id) DO NOTHING;

-- 9. Insertar Reserva Confirmada
INSERT INTO public.bookings (id, slot_id, reader_id, status, notes)
VALUES (
    '77777777-7777-7777-7777-777777777771',
    '66666666-6666-6666-6666-666666666661',
    'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
    'confirmed',
    'Deseo asesoría para estructurar un ensayo sobre la experiencia del aislamiento hospitalario durante la pandemia.'
) ON CONFLICT (id) DO NOTHING;
