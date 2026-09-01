export interface CalendarSession {
  id: string;
  title: string;
  startTime: string; // ISO 8601 UTC
  endTime: string;   // ISO 8601 UTC
  authorName: string;
  authorEmail?: string;
  readerName: string;
  readerEmail?: string;
  articleTitle?: string;
  notes?: string;
  virtualRoomUrl?: string;
}

export interface TimezoneOption {
  value: string;
  label: string;
  region: string;
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { value: 'America/Mexico_City', label: 'Ciudad de México (UTC-6)', region: 'México' },
  { value: 'America/Bogota', label: 'Bogotá / Lima / Quito (UTC-5)', region: 'Sudamérica' },
  { value: 'America/Santiago', label: 'Santiago de Chile (UTC-4 / UTC-3)', region: 'Chile' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (UTC-3)', region: 'Argentina' },
  { value: 'America/New_York', label: 'Nueva York / Miami (UTC-4)', region: 'EE.UU.' },
  { value: 'Europe/Madrid', label: 'Madrid / Barcelona (UTC+2)', region: 'España' },
  { value: 'UTC', label: 'Tiempo Universal Coordinado (UTC)', region: 'Global' },
];

/**
 * Formatea una fecha ISO en una representación UTC compacta para archivos .ics (ej. 20260903T160000Z)
 */
function formatToICSDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Genera el contenido estándar RFC 5545 iCalendar (.ics)
 */
export function generateICSContent(session: CalendarSession): string {
  const dtStamp = formatToICSDate(new Date().toISOString());
  const dtStart = formatToICSDate(session.startTime);
  const dtEnd = formatToICSDate(session.endTime);
  const uid = `anamnesis-${session.id}-${Date.now()}@anamnesis.com`;

  const summary = `Anamnesis: ${session.title}`;
  const description = [
    `Sesión de Diálogo y Mentoría Clínica / Literaria (30 minutos)`,
    `Autor: ${session.authorName} (${session.authorEmail || 'autor@anamnesis.com'})`,
    `Lector: ${session.readerName} (${session.readerEmail || 'lector@anamnesis.com'})`,
    session.articleTitle ? `Manuscrito de Referencia: ${session.articleTitle}` : '',
    session.notes ? `Notas del Lector: ${session.notes}` : '',
    `Sala Virtual: ${session.virtualRoomUrl || 'https://anamnesis.com/sala-virtual/' + session.id}`,
    `Plataforma Anamnesis — Humanismo & Curaduría Editorial`,
  ]
    .filter(Boolean)
    .join('\\n');

  const location = 'Sala Virtual Anamnesis (Online)';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Anamnesis Platform//Booking Module 1.0//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    `ORGANIZER;CN=${session.authorName}:MAILTO:${session.authorEmail || 'contacto@anamnesis.com'}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${session.readerName}:MAILTO:${session.readerEmail || 'lector@anamnesis.com'}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio: Tu sesión en Anamnesis inicia en 15 minutos',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Dispara la descarga del archivo .ics en el navegador del cliente
 */
export function downloadICSFile(session: CalendarSession): void {
  if (typeof window === 'undefined') return;

  const icsData = generateICSContent(session);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `anamnesis-sesion-${session.id.slice(0, 8)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Convierte una fecha ISO UTC a la zona horaria indicada y formatea la hora y día
 */
export function formatInTimezone(
  isoDateString: string,
  targetTimezone: string,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = new Date(isoDateString);
    const defaultOptions: Intl.DateTimeFormatOptions = options || {
      timeZone: targetTimezone,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('es-ES', defaultOptions).format(date);
  } catch (error) {
    // Fallback a hora local estándar
    return new Date(isoDateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
}

/**
 * Formatea solo el rango horario (ej. "16:00 - 16:30") en el huso horario especificado
 */
export function formatTimeRangeInZone(
  startIso: string,
  endIso: string,
  targetTimezone: string
): string {
  try {
    const startDate = new Date(startIso);
    const endDate = new Date(endIso);

    const formatter = new Intl.DateTimeFormat('es-ES', {
      timeZone: targetTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
  } catch (e) {
    return 'Horario no disponible';
  }
}

/**
 * Valida la regla de cancelación con mínimo 2 horas de anticipación
 */
export function validateCancellationRule(startTimeIso: string): {
  canCancel: boolean;
  hoursRemaining: number;
  message: string;
} {
  const sessionTime = new Date(startTimeIso).getTime();
  const now = Date.now();
  const diffMillis = sessionTime - now;
  const hoursRemaining = diffMillis / (1000 * 60 * 60);

  if (hoursRemaining >= 2) {
    return {
      canCancel: true,
      hoursRemaining: Math.round(hoursRemaining * 10) / 10,
      message: `Puedes cancelar esta sesión (faltan ${Math.round(hoursRemaining * 10) / 10} horas). El horario quedará libre para otros lectores.`,
    };
  }

  return {
    canCancel: false,
    hoursRemaining: Math.max(0, Math.round(hoursRemaining * 10) / 10),
    message: `No es posible cancelar: faltan menos de 2 horas para el inicio (${Math.max(0, Math.round(hoursRemaining * 10) / 10)} horas restantes). Política de compromiso de sesión.`,
  };
}
