# Anamnesis — Plataforma Literaria y Ensayística

Arquitectura base construida con **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Shadcn/UI** y **Supabase** (PostgreSQL, Auth, RLS y RBAC).

---

## 🌟 Características Implementadas

1. **Esquema de Base de Datos PostgreSQL en Supabase**:
   - `profiles`: Vinculada a `auth.users` mediante triggers automáticos con roles (`'reader'`, `'author'`, `'editor'`).
   - `circles`: Círculos editoriales temáticos con slug único y editor responsable.
   - `circle_members`: Membresías de usuarios en círculos con roles (`member`, `moderator`, `admin`).
   - `articles`: Ensayos y crónicas con estado (`'draft'`, `'published'`, `'archived'`), etiquetas, tiempo de lectura y contenido estructurado.
   - `comments`: Sistema de comentarios anidados (hilos de respuesta jerárquicos).
   - `bookmarks`: Marcadores de lectura privados por usuario.
   - `availability_slots`: Bloques de tiempo de autores para asesorías y tutorías.
   - `bookings`: Reservas confirmadas de lectores con autores.

2. **Políticas de Seguridad Row Level Security (RLS)**:
   - Protección a nivel de fila en todas las tablas.
   - Borradores ocultos para lectores no autorizados.
   - Marcadores y reservas privadas para los propietarios.

3. **Middleware de Autenticación y RBAC**:
   - Refresco de tokens transparente con cookies SSR (`@supabase/ssr`).
   - Restricción estricta de rutas de mesa editorial (`/circulo/[slug]/editor/*`) con redirección a página `/403` estilizada.
   - Selector interactivo de roles de prueba en la barra de navegación para pruebas locales inmediatas.

4. **Tema Claro / Oscuro sin FOUC**:
   - Configurado con `next-themes` y `suppressHydrationWarning`.
   - Variables CSS semánticas en Tailwind inspiradas en Shadcn UI.
   - Cero parpadeo blanco durante recarga o hidratación.

5. **Semilla de Datos (Seed Data)**:
   - Textos extensos y coherentes en español (cero *Lorem Ipsum*).
   - 3 usuarios de prueba con contraseña predefinida `Password123!`:
     - **Lector**: `lector@anamnesis.com` (*Sofía Valenzuela*)
     - **Autor**: `autor@anamnesis.com` (*Dr. Julián Sotomayor*)
     - **Editor**: `editor@anamnesis.com` (*Elena Rocafuerte*)
   - 3 círculos: *Reseña Literaria*, *Crónica*, *Ensayo Médico*.

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

#### Opción A: Desde el Dashboard de Supabase (Recomendada)
1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard).
2. Ve a la sección **SQL Editor**.
3. Pega el contenido del archivo `supabase/migrations/20240101000000_init_schema.sql` y haz clic en **Run**.
4. Pega el contenido del archivo `supabase/seed.sql` y haz clic en **Run**.

#### Opción B: Usando Supabase CLI
```bash
supabase db push
supabase db reset
```

### 4. Ejecutar el Servidor de Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🐙 Cómo Subir Este Proyecto a GitHub (Paso a Paso)

Sigue estos sencillos pasos para publicar tu proyecto en GitHub:

### Paso 1: Configurar tu identidad en Git (si es la primera vez)
```bash
git config --global user.name "Tu Nombre o Usuario"
git config --global user.email "tu-correo@ejemplo.com"
```

### Paso 2: Crear un nuevo repositorio en GitHub
1. Ingresa a [https://github.com/new](https://github.com/new).
2. En **Repository name**, escribe un nombre como `anamnesis-platform`.
3. Selecciona si quieres que sea **Public** (Público) o **Private** (Privado).
4. **IMPORTANTE**: No marques "Add a README file", "Add .gitignore" ni "Choose a license" (ya están configurados en el proyecto).
5. Haz clic en **Create repository**.

### Paso 3: Vincular y Subir tu Proyecto

Ejecuta los siguientes comandos en tu terminal dentro de la carpeta del proyecto:

```bash
# 1. Asegurar que git esté inicializado
git init

# 2. Agregar todos los archivos al control de versiones
git add .

# 3. Crear el primer commit
git commit -m "feat: initial Next.js 14 + Supabase architecture with RBAC and dark mode"

# 4. Establecer la rama principal como 'main'
git branch -M main

# 5. Conectar tu repositorio local con el remoto de GitHub
# (Reemplaza TU_USUARIO y TU_REPOSITORIO con tus datos reales)
git remote add origin https://github.com/TU_USUARIO/anamnesis-platform.git

# 6. Subir tu código
git push -u origin main
```

---

## 📂 Estructura de Directorios

```text
├── supabase/
│   ├── migrations/
│   │   └── 20240101000000_init_schema.sql  # Esquema PostgreSQL, Enums, RLS y Triggers
│   └── seed.sql                            # Datos semilla en español con usuarios y artículos
├── src/
│   ├── app/
│   │   ├── circulo/
│   │   │   └── [slug]/
│   │   │       ├── articulos/[articleSlug]/ # Lector de manuscrito y comentarios
│   │   │       ├── editor/                  # Mesa editorial (Protegida por RBAC)
│   │   │       └── page.tsx                 # Portada del Círculo
│   │   ├── agenda/                          # Agendamiento de citas
│   │   ├── login/                           # Autenticación y acceso rápido
│   │   ├── 403/                             # Página de acceso restringido RBAC
│   │   ├── not-found.tsx                    # Error 404
│   │   ├── error.tsx                        # Error Boundary
│   │   ├── globals.css                      # Tailwind y variables CSS Shadcn
│   │   ├── layout.tsx                       # Root Layout con ThemeProvider y Navbar
│   │   └── page.tsx                         # Portada principal
│   ├── components/
│   │   ├── ui/                              # Primitivas de Shadcn (Button, Card, Badge, etc.)
│   │   ├── navbar.tsx                       # Barra de navegación con estado y accesos
│   │   ├── role-selector.tsx                # Selector interactivo de simulación RBAC
│   │   ├── theme-provider.tsx               # Envoltorio next-themes
│   │   └── theme-toggle.tsx                 # Alternador de tema claro/oscuro
│   ├── lib/
│   │   ├── supabase/                        # Clientes SSR para navegador, servidor y middleware
│   │   └── utils.ts                         # Utilidad cn() y formateadores
│   ├── types/
│   │   └── database.types.ts                # Tipos TypeScript de PostgreSQL
│   └── middleware.ts                        # Middleware de rutas y RBAC
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
