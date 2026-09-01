# Anamnesis — Plataforma Literaria y Ensayística

Arquitectura base, sistema de gestión de círculos, editor TipTap con IA, agendamiento de sesiones, experiencia del lector y comunidad con **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Tailwind Typography (Prose)**, **Shadcn/UI**, **TipTap**, **Google Gemini AI (@google/genai)**, **Resend** y **Supabase** (PostgreSQL, Realtime, Auth, RLS y Storage).

---

## 🌟 Características Implementadas

1. **Experiencia del Lector & Comunidad**:
   - **Lectura Larga Optimizada**: Tipografía ensayística con `prose prose-lg dark:prose-invert`, barra de progreso de lectura ligada al scroll, y controles de tamaño de letra y tipografía (Serif/Sans).
   - **Sistema de Marcadores ("Guardar para después")**: Guardado instantáneo vinculado al perfil del lector.
   - **Búsqueda en Tiempo Real & Filtros Multifacéticos (`/explorar`)**: Búsqueda reactiva con **debounce de 300ms** y filtros combinados por tema/tag, autor, círculo, tiempo de lectura y marcadores guardados.
   - **Comentarios Anidados en Tiempo Real & Moderación Editorial**: Hilos de discusión con soporte de **Supabase Realtime** y controles de moderación para que los editores del círculo oculten (`is_hidden = true`) o restauren comentarios.

2. **API Routes Seguras & Server Actions (Cero API Keys en el Cliente)**:
   - **Asistente Editorial Gemini IA (`/api/ai/suggest`)**: Sugiere 3 títulos, resumen breve y 4 etiquetas con degradación elegante.
   - **Correos Transaccionales con Resend (`/api/email/*`)**: Notificaciones de citas en husos horarios locales y avisos de nuevos comentarios al autor.
   - **Almacenamiento Seguro de Imágenes (`/api/storage/upload`)**: Subida a Supabase Storage con validación de tipo MIME y tamaño.

3. **Editor de Artículos con TipTap (`/editor/[id]`)**:
   - Formato enriquecido, citas de libros con **Open Library**, sanitización estricta contra **XSS** y Word con **DOMPurify**, autoguardado a 5 segundos con indicador visual y asistente IA.

4. **Módulo de Agendamiento de 30 Minutos (Lectores y Autores)**:
   - Panel de disponibilidad del autor y vista *"Mi Día"* (`/dashboard/autor/disponibilidad`).
   - Reserva de lectores con conversión dinámica de husos horarios (`/agenda`).
   - Prevención de doble reserva con transacción atómica PostgreSQL `SELECT ... FOR UPDATE`.
   - Regla de cancelación a 2 horas y exportación de archivos `.ics`.

---

## 🚀 Inicio Rápido

```bash
npm install
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🐙 Subir Este Proyecto a GitHub

```bash
git add .
git commit -m "feat(reader): implement long-form prose typography, bookmarks, 300ms debounced search filters and realtime moderated threaded comments"
git push origin main
```
