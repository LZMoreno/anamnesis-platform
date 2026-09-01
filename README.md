# Anamnesis — Plataforma Literaria y Ensayística

Arquitectura base, sistema de gestión de círculos, editor TipTap y módulo de agendamiento de sesiones construido con **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Shadcn/UI**, **TipTap** y **Supabase** (PostgreSQL, Auth, RLS y RBAC).

---

## 🌟 Características Implementadas

1. **Módulo de Agendamiento de Sesiones de 30 Minutos (Lectores y Autores)**:
   - **Panel de Disponibilidad del Autor (`/dashboard/autor/disponibilidad`)**:
     - Configuración de bloques de 30 minutos y generador rápido por lotes (turno mañana/tarde).
     - Vista *"Mi Día"*: Lista de citas de la jornada con datos del lector, manuscrito referenciado y estado.
   - **Reserva para Lectores con Husos Horarios Dinámicos (`/agenda`)**:
     - Detección automática y selector manual de husos horarios (`Intl.DateTimeFormat`) con recálculo en tiempo real.
     - Modal de reserva con selección de manuscrito a discutir y notas.
   - **Prevención de Doble Reserva (Race Conditions)**:
     - Transacción atómica PostgreSQL con bloqueo explícito `SELECT ... FOR UPDATE` en `book_slot_atomic`.
     - Mensaje amigable al usuario: *"Este espacio acaba de ser reservado por otro lector. Por favor, selecciona otro horario disponible."*
   - **Regla de Cancelación a 2 Horas & Exportación `.ics`**:
     - Cancelaciones permitidas solo con $\ge 2\text{h}$ de anticipación mediante `cancel_booking_atomic`.
     - Exportación y descarga directa de archivos iCalendar `.ics` compatibles con Google Calendar, Apple Calendar y Outlook.

2. **Editor de Artículos con TipTap (`/editor/[id]`)**:
   - Formato enriquecido, citas de libros con la API de **Open Library**, sanitización estricta contra **XSS** y Microsoft Word con **DOMPurify**, optimización para textos de más de 9,000 palabras y autoguardado a 5 segundos con indicador visual.
   - Toggle entre modo edición y vista previa de publicación editorial.

3. **Esquema de Base de Datos PostgreSQL en Supabase**:
   - `profiles`, `circles`, `circle_members`, `circle_invitations`, `articles`, `comments`, `bookmarks`, `availability_slots`, `bookings`.
   - Triggers automáticos y políticas **Row Level Security (RLS)** en todas las tablas.

4. **Rutas Dinámicas & Perfiles Públicos**:
   - `/circulo/[slug]`, `/autor/[id]`, `/circulo/[slug]/editor/members`, `/circulo/[slug]/articulos/[articleSlug]`.
   - Objetivos táctiles ergonómicos de mínimo **$44\text{px}$** (`min-h-[44px]`) y navegación móvil fluida desde **$320\text{px}$** sin desbordamiento horizontal.

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

### 3. Aplicar Migraciones en Supabase (SQL Editor)
1. `supabase/migrations/20240101000000_init_schema.sql`
2. `supabase/migrations/20240102000000_circle_management_and_invitations.sql`
3. `supabase/migrations/20240103000000_atomic_booking_system.sql`
4. `supabase/seed.sql`

### 4. Servidor de Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🐙 Subir Este Proyecto a GitHub

```bash
git add .
git commit -m "feat(booking): implement 30-min booking system, author availability dashboard, dynamic timezones and atomic race condition protection"
git push origin main
```
