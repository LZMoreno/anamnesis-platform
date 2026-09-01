# Anamnesis — Plataforma Literaria y Ensayística

Arquitectura base y sistema de gestión de círculos construidos con **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Shadcn/UI** y **Supabase** (PostgreSQL, Auth, RLS y RBAC).

---

## 🌟 Características Implementadas

1. **Esquema de Base de Datos PostgreSQL en Supabase**:
   - `profiles`: Vinculada a `auth.users` mediante triggers automáticos con roles (`'reader'`, `'author'`, `'editor'`).
   - `circles`: Círculos editoriales temáticos con slug único y editor responsable.
   - `circle_members`: Membresías de usuarios en círculos con roles (`member`, `moderator`, `admin`).
   - `circle_invitations`: Sistema de invitaciones con tokens únicos y expiración a 7 días.
   - `articles`: Ensayos y crónicas con estado (`'draft'`, `'published'`, `'archived'`), etiquetas, tiempo de lectura y contenido estructurado.
   - `comments`: Sistema de comentarios anidados (hilos de respuesta jerárquicos).
   - `bookmarks`: Marcadores de lectura privados por usuario.
   - `availability_slots`: Bloques de tiempo de autores para asesorías y tutorías.
   - `bookings`: Reservas confirmadas de lectores con autores.

2. **Políticas de Seguridad Row Level Security (RLS)**:
   - Protección a nivel de fila en todas las tablas.
   - Solo el `editor_id` del círculo o co-editores administradores pueden invitar autores (`circle_invitations`), cambiar roles o revocar membresías en su círculo (`circle_members`).
   - Borradores ocultos para lectores no autorizados.

3. **Rutas Dinámicas & Perfiles Públicos**:
   - `/circulo/[slug]`: Portada, manifiesto, ficha de curaduría del editor y lista de artículos con filtros por etiquetas.
   - `/autor/[id]`: Perfil público del autor con biografía, zona horaria, métricas de lectura, listado de todas sus obras publicadas y enlace para agendar tutorías.
   - `/circulo/[slug]/articulos/[articleSlug]`: Lector inmersivo con comentarios anidados y ficha de autor.

4. **Panel de Gestión del Editor (`/circulo/[slug]/editor/members`)**:
   - Formulario para invitar autores por correo electrónico con selección de rol (`member`, `moderator`, `admin`).
   - Gestión interactiva de miembros activos: modificar roles o revocar accesos.
   - Bandeja de invitaciones pendientes con opción de reenviar o cancelar.

5. **Adaptabilidad Móvil y UI Táctil**:
   - Todos los botones, enlaces y campos interactivos tienen un tamaño táctil mínimo de **$44\text{px}$** (`min-h-[44px]`).
   - Menú hamburguesa accesible en dispositivos móviles ($< 1024\text{px}$).
   - Navegación fluida y adaptada desde **$320\text{px}$** sin scroll horizontal.

6. **Tema Claro / Oscuro sin FOUC**:
   - Configurado con `next-themes` y `suppressHydrationWarning`.
   - Variables CSS semánticas en Tailwind inspiradas en Shadcn UI.

---

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```
Rellena tus credenciales de Supabase (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

### 3. Aplicar Migraciones y Datos Semilla en Supabase
1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard).
2. Ve a la sección **SQL Editor**.
3. Ejecuta `supabase/migrations/20240101000000_init_schema.sql`.
4. Ejecuta `supabase/migrations/20240102000000_circle_management_and_invitations.sql`.
5. Ejecuta `supabase/seed.sql`.

### 4. Ejecutar el Servidor de Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🐙 Cómo Subir Este Proyecto a GitHub

```bash
# 1. Asegurar que git esté inicializado
git init

# 2. Agregar todos los archivos al control de versiones
git add .

# 3. Crear commit
git commit -m "feat: circles system, public author profiles, editor members panel with RLS and mobile touch targets"

# 4. Establecer la rama principal como 'main'
git branch -M main

# 5. Conectar tu repositorio remoto de GitHub (reemplaza TU_USUARIO y TU_REPOSITORIO)
git remote add origin https://github.com/TU_USUARIO/anamnesis-platform.git

# 6. Subir tu código
git push -u origin main
```
