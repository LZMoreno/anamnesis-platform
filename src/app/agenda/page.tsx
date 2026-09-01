'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  Calendar as CalendarIcon,
  CalendarCheck,
  CheckCircle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Globe,
  HelpCircle,
  Info,
  Loader2,
  MessageSquare,
  Sparkles,
  UserCheck,
  Video,
  X,
  Zap,
} from 'lucide-react';
import {
  INITIAL_AUTHORS,
  INITIAL_ARTICLES,
  AvailabilitySlotItem,
  BookingSessionItem,
  getAvailabilitySlots,
  getBookingsByReader,
  bookSlotAtomicMock,
  cancelBookingAtomicMock,
} from '@/lib/data/mock-db';
import {
  downloadICSFile,
  formatInTimezone,
  formatTimeRangeInZone,
  validateCancellationRule,
  TIMEZONE_OPTIONS,
  TimezoneOption,
} from '@/lib/calendar/ics-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export default function AgendaPage() {
  const readerId = 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa'; // Sofía Valenzuela

  // Estado de Zona Horaria Dinámica del Lector
  const [userTimezone, setUserTimezone] = React.useState<string>('America/Mexico_City');
  const [activeTab, setActiveTab] = React.useState<'available-slots' | 'my-bookings'>('available-slots');
  const [selectedAuthorId, setSelectedAuthorId] = React.useState<string>('all');
  
  // Datos
  const [slots, setSlots] = React.useState<AvailabilitySlotItem[]>([]);
  const [myBookings, setMyBookings] = React.useState<BookingSessionItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Modal de Reserva
  const [bookingSlot, setBookingSlot] = React.useState<AvailabilitySlotItem | null>(null);
  const [selectedArticleId, setSelectedArticleId] = React.useState<string>('');
  const [bookingNotes, setBookingNotes] = React.useState<string>('');
  const [simulateConflict, setSimulateConflict] = React.useState(false);
  const [isBooking, setIsBooking] = React.useState(false);

  // Modal de Cancelación
  const [cancelBookingItem, setCancelBookingItem] = React.useState<BookingSessionItem | null>(null);
  const [isCancelling, setIsCancelling] = React.useState(false);

  // Feedback Notification
  const [feedback, setFeedback] = React.useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    bookingToExport?: BookingSessionItem;
  } | null>(null);

  // Detectar automáticamente la zona horaria del navegador
  React.useEffect(() => {
    try {
      const detectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detectedZone) {
        setUserTimezone(detectedZone);
      }
    } catch (e) {
      console.warn('Could not auto-detect timezone', e);
    }
  }, []);

  const loadData = () => {
    setSlots(getAvailabilitySlots());
    setMyBookings(getBookingsByReader(readerId));
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // Filtrar slots disponibles
  const availableSlots = slots.filter((slot) => {
    if (slot.isBooked) return false;
    if (selectedAuthorId !== 'all' && slot.authorId !== selectedAuthorId) return false;
    return true;
  });

  // Artículos del autor seleccionado en el modal
  const authorArticles = bookingSlot
    ? INITIAL_ARTICLES.filter((a) => a.authorId === bookingSlot.authorId && a.status === 'published')
    : [];

  // Ejecutar reserva atómica con bloqueo PostgreSQL (RPC)
  const handleConfirmBooking = async () => {
    if (!bookingSlot) return;

    setIsBooking(true);
    setFeedback(null);

    const res = await bookSlotAtomicMock(
      bookingSlot.id,
      readerId,
      selectedArticleId || undefined,
      bookingNotes,
      simulateConflict
    );

    setIsBooking(false);
    setBookingSlot(null);
    setBookingNotes('');
    setSelectedArticleId('');

    if (res.success && res.bookingId) {
      loadData();
      const newBook = getBookingsByReader(readerId).find((b) => b.id === res.bookingId);

      // Enviar correo transaccional en segundo plano vía Resend (/api/email/booking-confirmation)
      if (newBook) {
        fetch('/api/email/booking-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: newBook.id,
            startTime: newBook.startTime,
            endTime: newBook.endTime,
            readerName: newBook.readerName,
            readerEmail: newBook.readerEmail,
            readerTimezone: userTimezone,
            authorName: newBook.authorName,
            authorEmail: newBook.authorEmail,
            authorTimezone: newBook.authorTimezone,
            articleTitle: newBook.articleTitle,
            notes: newBook.notes,
          }),
        }).catch((err) => console.warn('Error enviando correo transaccional:', err));
      }

      setFeedback({
        type: 'success',
        title: '¡Sesión de 30 Minutos Reservada!',
        message: `${res.message} Se ha enviado un correo de confirmación con los horarios convertidos a tu huso horario y al del autor.`,
        bookingToExport: newBook,
      });
    } else {
      // Manejo de Race Condition (doble reserva simultánea)
      setFeedback({
        type: 'error',
        title: res.errorCode === 'ALREADY_BOOKED' ? 'Horario No Disponible' : 'Error al Reservar',
        message: res.message,
      });
      loadData();
    }
  };

  // Ejecutar cancelación atómica
  const handleConfirmCancel = async () => {
    if (!cancelBookingItem) return;

    setIsCancelling(true);
    setFeedback(null);

    const res = await cancelBookingAtomicMock(cancelBookingItem.id, readerId);
    setIsCancelling(false);
    setCancelBookingItem(null);

    if (res.success) {
      loadData();
      setFeedback({
        type: 'info',
        title: 'Sesión Cancelada',
        message: res.message,
      });
    } else {
      setFeedback({
        type: 'error',
        title: 'No se Pudo Cancelar',
        message: res.message,
      });
    }
  };

  // Descargar .ics
  const handleExportICS = (session: BookingSessionItem) => {
    downloadICSFile({
      id: session.id,
      title: `Mentoría con ${session.authorName} - ${session.articleTitle || 'Diálogo Clínico'}`,
      startTime: session.startTime,
      endTime: session.endTime,
      authorName: session.authorName,
      authorEmail: session.authorEmail,
      readerName: session.readerName,
      readerEmail: session.readerEmail,
      articleTitle: session.articleTitle,
      notes: session.notes,
      virtualRoomUrl: `https://anamnesis.com/sala-virtual/${session.id}`,
    });
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-background pb-24">
      {/* Top Breadcrumb */}
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="container mx-auto max-w-6xl px-3 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 min-h-[44px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>

          <Link
            href="/dashboard/autor/disponibilidad"
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 min-h-[44px]"
          >
            ¿Eres autor? Gestionar mi disponibilidad →
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-3 sm:px-6 pt-6 sm:pt-10 space-y-8">
        {/* Header & Timezone Selector Banner */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs gap-1.5 py-1 px-3">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Sesiones Individuales de 30 Minutos
              </Badge>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Agenda de Asesorías & Diálogo Clínico
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Reserva bloques de 30 minutos con autores y ensayistas para debatir manuscritos, bioética y metodología narrativa.
              </p>
            </div>

            {/* Dynamic Local Timezone Selector */}
            <div className="p-3.5 rounded-xl border border-primary/30 bg-card shadow-sm space-y-1.5 min-w-[280px]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary" /> Tu Huso Horario Local:
                </span>
                <span className="text-[10px] text-muted-foreground">Auto-detectado</span>
              </div>

              <select
                value={userTimezone}
                onChange={(e) => setUserTimezone(e.target.value)}
                className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
                {!TIMEZONE_OPTIONS.some((tz) => tz.value === userTimezone) && (
                  <option value={userTimezone}>{userTimezone} (Tu sistema)</option>
                )}
              </select>
              <div className="text-[10px] text-muted-foreground italic">
                Todos los horarios se recalculan automáticamente en tu hora local.
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
                : feedback.type === 'error'
                ? 'bg-destructive/10 border-destructive/30 text-destructive'
                : 'bg-primary/10 border-primary/30 text-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm flex items-center gap-2">
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                )}
                {feedback.title}
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded hover:opacity-70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="leading-relaxed text-xs">{feedback.message}</p>

            {/* Quick ICS download button after booking */}
            {feedback.bookingToExport && (
              <div className="pt-2">
                <Button
                  onClick={() => handleExportICS(feedback.bookingToExport!)}
                  className="min-h-[44px] text-xs font-semibold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Download className="w-4 h-4" /> Descargar Evento .ics para Calendario
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation & Author Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-1">
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('available-slots')}
              className={`flex items-center gap-2 min-h-[44px] px-4 py-2 border-b-2 transition ${
                activeTab === 'available-slots'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Horarios Disponibles ({availableSlots.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`flex items-center gap-2 min-h-[44px] px-4 py-2 border-b-2 transition ${
                activeTab === 'my-bookings'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mis Sesiones Agendadas ({myBookings.length})</span>
            </button>
          </div>

          {/* Author Filter (when in available slots tab) */}
          {activeTab === 'available-slots' && (
            <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
              <span className="text-muted-foreground">Filtrar por autor:</span>
              <select
                value={selectedAuthorId}
                onChange={(e) => setSelectedAuthorId(e.target.value)}
                className="min-h-[44px] rounded-lg border border-input bg-background px-3 text-xs font-medium focus:outline-none"
              >
                <option value="all">Todos los autores</option>
                <option value="bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb">Dr. Julián Sotomayor</option>
                <option value="cccccccc-3333-4333-c333-cccccccccccc">Elena Rocafuerte</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: HORARIOS DISPONIBLES */}
        {activeTab === 'available-slots' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {availableSlots.length === 0 ? (
              <Card className="p-8 text-center space-y-3">
                <Clock className="w-10 h-10 mx-auto text-muted-foreground/60" />
                <div className="font-serif font-bold text-base">No hay espacios disponibles para este filtro</div>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Prueba cambiando el filtro de autor o vuelve a consultar más tarde para nuevos bloques de 30 minutos.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {availableSlots.map((slot) => {
                  const author = INITIAL_AUTHORS[slot.authorId];
                  // Fecha formateada en la zona horaria del lector
                  const dateLocalStr = formatInTimezone(slot.startTime, userTimezone, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  });
                  // Rango de horas en zona del lector
                  const timeRangeLocal = formatTimeRangeInZone(slot.startTime, slot.endTime, userTimezone);
                  // Rango de horas en zona del autor
                  const timeRangeAuthor = formatTimeRangeInZone(slot.startTime, slot.endTime, slot.authorTimezone);

                  return (
                    <Card key={slot.id} className="flex flex-col justify-between hover:border-primary/50 transition-all shadow-sm">
                      <CardHeader className="p-5 pb-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px]">
                            30 Minutos • Libre
                          </Badge>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {formatInTimezone(slot.startTime, userTimezone, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        {/* Author Info */}
                        <Link
                          href={`/autor/${slot.authorId}`}
                          className="flex items-center gap-3 pt-1 group min-h-[44px]"
                        >
                          <Avatar src={slot.authorAvatar} fallback="AU" className="w-10 h-10 border shrink-0" />
                          <div className="overflow-hidden">
                            <div className="font-serif font-bold text-sm text-foreground group-hover:text-primary transition truncate">
                              {slot.authorName}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">
                              {author?.specialty}
                            </div>
                          </div>
                        </Link>
                      </CardHeader>

                      <CardContent className="p-5 pt-0 space-y-4">
                        {/* Time in Reader Timezone */}
                        <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs space-y-1">
                          <div className="text-[10px] uppercase font-semibold text-primary">
                            Hora en tu ciudad ({userTimezone.split('/')[1] || userTimezone}):
                          </div>
                          <div className="font-mono text-base font-bold text-foreground">
                            {timeRangeLocal}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Hora del autor: {timeRangeAuthor} ({slot.authorTimezone.split('/')[1] || slot.authorTimezone})
                          </div>
                        </div>

                        <Button
                          onClick={() => setBookingSlot(slot)}
                          className="w-full min-h-[44px] text-xs font-semibold bg-primary hover:bg-primary/90"
                        >
                          Reservar este Espacio (30 min)
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MIS SESIONES AGENDADAS */}
        {activeTab === 'my-bookings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {myBookings.length === 0 ? (
              <Card className="p-8 text-center space-y-3">
                <CalendarCheck className="w-10 h-10 mx-auto text-muted-foreground/60" />
                <div className="font-serif font-bold text-base">No tienes sesiones agendadas</div>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Explora los horarios disponibles de nuestros autores y reserva un espacio de diálogo.
                </p>
                <Button
                  onClick={() => setActiveTab('available-slots')}
                  className="min-h-[44px] text-xs font-medium mt-2 bg-primary hover:bg-primary/90"
                >
                  Ver Horarios Disponibles
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {myBookings.map((session) => {
                  const isConfirmed = session.status === 'confirmed';
                  const timeRangeLocal = formatTimeRangeInZone(session.startTime, session.endTime, userTimezone);
                  const dateLocalStr = formatInTimezone(session.startTime, userTimezone, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  });
                  const cancelValidation = validateCancellationRule(session.startTime);

                  return (
                    <Card
                      key={session.id}
                      className={`flex flex-col justify-between shadow-sm transition ${
                        isConfirmed ? 'border-primary/40' : 'opacity-60 bg-muted/20'
                      }`}
                    >
                      <CardHeader className="p-5 pb-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`text-[10px] ${
                              isConfirmed ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {isConfirmed ? '● Confirmada (30 min)' : '✕ Cancelada'}
                          </Badge>
                          <span className="text-xs font-mono font-bold text-primary">
                            {timeRangeLocal}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <Avatar src={session.authorAvatar} fallback="AU" className="w-11 h-11 border shrink-0" />
                          <div className="space-y-0.5">
                            <div className="font-serif font-bold text-sm text-foreground">
                              {session.authorName}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {dateLocalStr}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-5 pt-0 space-y-4">
                        {session.articleTitle && (
                          <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1 border border-border/40">
                            <div className="text-[10px] uppercase font-semibold text-primary flex items-center gap-1">
                              <FileText className="w-3 h-3" /> Manuscrito a tratar:
                            </div>
                            <div className="font-serif font-medium text-foreground">
                              {session.articleTitle}
                            </div>
                          </div>
                        )}

                        {session.notes && (
                          <p className="text-xs text-muted-foreground italic font-serif">
                            «{session.notes}»
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/40">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handleExportICS(session)}
                              className="min-h-[44px] text-xs font-medium gap-1.5 px-3"
                              title="Descargar archivo .ics"
                            >
                              <Download className="w-3.5 h-3.5" /> .ics
                            </Button>

                            {isConfirmed && (
                              <Button
                                variant="ghost"
                                onClick={() => setCancelBookingItem(session)}
                                className="min-h-[44px] text-xs font-medium text-destructive hover:bg-destructive/10 px-3"
                              >
                                Cancelar
                              </Button>
                            )}
                          </div>

                          {isConfirmed && (
                            <Button className="min-h-[44px] text-xs font-medium gap-1.5 bg-primary hover:bg-primary/90 px-4">
                              <Video className="w-4 h-4" /> Entrar a Sala
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOOKING CONFIRMATION MODAL WITH RACE CONDITION TEST */}
      {bookingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border bg-card p-5 sm:p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="font-serif font-bold text-base flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" /> Confirmar Reserva de 30 Minutos
              </div>
              <button
                onClick={() => setBookingSlot(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author & Time Details */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 flex items-center gap-3">
              <Avatar src={bookingSlot.authorAvatar} fallback="AU" className="w-12 h-12 border shrink-0" />
              <div className="space-y-0.5">
                <div className="font-serif font-bold text-sm text-foreground">{bookingSlot.authorName}</div>
                <div className="font-mono text-primary font-semibold">
                  {formatTimeRangeInZone(bookingSlot.startTime, bookingSlot.endTime, userTimezone)} ({userTimezone.split('/')[1] || userTimezone})
                </div>
                <div className="text-[10px] text-muted-foreground capitalize">
                  {formatInTimezone(bookingSlot.startTime, userTimezone, { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>

            {/* Select Article to discuss */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Seleccionar Manuscrito / Ensayo para la Sesión:
              </label>
              <select
                value={selectedArticleId}
                onChange={(e) => setSelectedArticleId(e.target.value)}
                className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3 text-xs"
              >
                <option value="">Consulta general / Diálogo bioético abierto</option>
                {authorArticles.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.title} ({art.circleName})
                  </option>
                ))}
              </select>
            </div>

            {/* Notes / Questions */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Notas, Preguntas o Temas de Interés (Opcional):
              </label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="Indica qué aspectos te gustaría conversar con el autor..."
                rows={3}
                className="w-full p-2.5 rounded-lg border border-input bg-background text-xs font-serif resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Race Condition Simulation Switch (For Testing Double Bookings) */}
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateConflict}
                  onChange={(e) => setSimulateConflict(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  Simular Conflicto / Race Condition (Reserva Simultánea)
                </span>
              </label>
              <p className="text-[10px] text-muted-foreground leading-relaxed pl-6">
                Prueba la transacción atómica con bloqueo PostgreSQL: simula que otro lector reservó la ranura milisegundos antes.
              </p>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/40">
              <Button
                variant="outline"
                onClick={() => setBookingSlot(null)}
                className="min-h-[44px] text-xs font-medium"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="min-h-[44px] text-xs font-semibold bg-primary hover:bg-primary/90 px-5 gap-1.5"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verificando disponibilidad...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" /> Confirmar Cita (30 min)
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION MODAL WITH 2-HOUR RULE */}
      {cancelBookingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="font-serif font-bold text-base text-destructive flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Cancelar Cita Agendada
              </div>
              <button
                onClick={() => setCancelBookingItem(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-foreground">
              ¿Deseas cancelar tu sesión con <strong>{cancelBookingItem.authorName}</strong>?
            </p>

            {/* 2-Hour Validation Rule */}
            {(() => {
              const rule = validateCancellationRule(cancelBookingItem.startTime);
              return (
                <div
                  className={`p-3 rounded-lg border leading-relaxed ${
                    rule.canCancel
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-destructive/10 border-destructive/30 text-destructive'
                  }`}
                >
                  <strong>Regla de 2 horas:</strong> {rule.message}
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <Button
                variant="outline"
                onClick={() => setCancelBookingItem(null)}
                className="min-h-[44px] text-xs font-medium"
              >
                Volver
              </Button>
              <Button
                variant="destructive"
                disabled={!validateCancellationRule(cancelBookingItem.startTime).canCancel || isCancelling}
                onClick={handleConfirmCancel}
                className="min-h-[44px] text-xs font-medium"
              >
                {isCancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
