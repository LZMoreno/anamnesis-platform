# Anamnesis — Plataforma Literaria y Ensayística

Arquitectura base, sistema de gestión de círculos, editor TipTap con IA, agendamiento de sesiones y servicios externos seguros con **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Shadcn/UI**, **TipTap**, **Google Gemini AI (@google/genai)**, **Resend** y **Supabase** (PostgreSQL, Auth, RLS y Storage).

---

## 🌟 Servicios y Características Implementadas

1. **API Routes Seguras & Server Actions (Cero API Keys en el Cliente)**:
   - **Asistente Editorial Gemini IA (`/api/ai/suggest`)**:
     - Conectado a la API oficial de Google Gemini (`@google/genai`, modelo `gemini-2.5-flash`).
     - Devuelve 3 propuestas de títulos, un resumen breve y 4 etiquetas temáticas en español.
     - **Degradación Elegante (Graceful Degradation)**: Si no hay clave de IA o hay fallas de red, muestra un banner ligero sin bloquear ni congelar la pantalla.
   - **Correos Transaccionales con Resend (`/api/email/*`)**:
     - `/api/email/booking-confirmation`: Envía confirmación al Lector y al Autor calculando fechas/horas en sus respectivos husos horarios.
     - `/api/email/new-comment`: Notifica al autor por correo electrónico al recibir un nuevo comentario en sus artículos.
   - **Almacenamiento Seguro de Imágenes (`/api/storage/upload`)**:
     - Validación de tipo MIME y tamaño ($\le 10\text{MB}$) con subida directa a Supabase Storage.

2. **Editor de Artículos con TipTap (`/editor/[id]`)**:
   - Formato enriquecido, citas de libros de **Open Library API**, sanitización estricta contra **XSS** y Word con **DOMPurify**, optimización para textos de más de 9,000 palabras, autoguardado a 5 segundos con indicador visual y botón *"Asistente IA ✨"*.

3. **Módulo de Agendamiento de Sesiones de 30 Minutos (Lectores y Autores)**:
   - Panel de disponibilidad del autor y vista *"Mi Día"* (`/dashboard/autor/disponibilidad`).
   - Reserva de lectores con conversión dinámica de husos horarios (`/agenda`).
   - Prevención de doble reserva con transacción atómica PostgreSQL `SELECT ... FOR UPDATE`.
   - Regla de cancelación a 2 horas y exportación de archivos `.ics` (Google / Apple / Outlook Calendar).

4. **Esquema PostgreSQL en Supabase con RLS**:
   - 9 tablas completas con políticas de seguridad Row Level Security y triggers automáticos.

---

## 🚀 Variables de Entorno

Copia el archivo de ejemplo y configura tus claves (las claves privadas nunca se exponen al cliente):
```bash
cp .env.example .env.local
```

```env
# Claves públicas (cliente)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Claves privadas (solo servidor - nunca exponer en cliente)
GEMINI_API_KEY=tu-google-gemini-api-key
RESEND_API_KEY=re_tu_resend_api_key
RESEND_FROM_EMAIL=Anamnesis <notificaciones@anamnesis.com>
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

---

## 🐙 Subir Este Proyecto a GitHub

```bash
git add .
git commit -m "feat(api): implement secure server routes for Gemini AI suggest, Resend transactional emails and Supabase storage upload"
git push origin main
```
