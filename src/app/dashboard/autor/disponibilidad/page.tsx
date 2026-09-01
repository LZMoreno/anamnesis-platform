'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  User,
  Video,
  X,
  XCircle,
} from 'lucide-react';
import {
  INITIAL_AUTHORS,
  INITIAL_SLOTS,
  INITIAL_BOOKINGS,
  AvailabilitySlotItem,
  BookingSessionItem,
  getAvailabilitySlots,
  getBookingsByAuthor,
  createSlotMock,
  deleteSlotMock,
  cancelBookingAtomicMock,
} from '@/lib/data/mock-db';
import {
  downloadICSFile,
  formatInTimezone,
  formatTimeRangeInZone,
  validateCancellationRule,
  TIMEZONE_OPTIONS,
} from '@/lib/calendar/ics-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export default function AuthorAvailabilityDashboard() {
  const authorId = 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb'; // Dr. Julián Sotomayor
  const author = INITIAL_AUTHORS[authorId];

  const [activeTab, setActiveTab] = React.useState<'my-day' | 'manage-slots'>('my-day');
  const [slots, setSlots] = React.useState<AvailabilitySlotItem[]>([]);
  const [bookings, setBookings] = React.useState<BookingSessionItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [actionMessage, setActionMessage] = React.useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Formulario de nuevo slot
  const todayStr = new Date().toISOString().split('T')[0];
  const [slotDate, setSlotDate] = React.useState(todayStr);
  const [slotStartTime, setSlotStartTime] = React.useState('10:00');
  const [creating, setCreating] = React.useState(false);

  // Modal de cancelación
  const [cancelModalBooking, setCancelModalBooking] = React.useState<BookingSessionItem | null>(null);
  const [cancelling, setCancelling] = React.useState(false);

  // Cargar datos del autor
  const loadData = () => {
    setSlots(getAvailabilitySlots(authorId));
    setBookings(getBookingsByAuthor(authorId));
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // Filtrar sesiones de "Mi Día" (hoy)
  const todaySessions = bookings.filter((b) => {
    const bookingDate = new Date(b.startTime).toISOString().split('T')[0];
    return bookingDate === todayStr;
  });

  // Crear slot de 30 minutos
  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotDate || !slotStartTime) return;

    setCreating(true);
    setActionMessage(null);

    // Calcular hora de fin a 30 minutos
    const startIso = new Date(`${slotDate}T${slotStartTime}:00.000Z`).toISOString();
    const startDate = new Date(startIso);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // +30 minutos
    const endIso = endDate.toISOString();

    await createSlotMock(authorId, startIso, endIso);
    loadData();
    setCreating(false);
    setActionMessage({
      type: 'success',
      text: `Bloque de 30 minutos (${slotStartTime} - ${slotStartTime.slice(0, 2)}:30) agregado con éxito.`,
    });
  };

  // Generador rápido por lotes (Turno mañana / Turno tarde)
  const handleBatchGenerate = async (period: 'morning' | 'afternoon') => {
    setLoading(true);
    setActionMessage(null);

    const baseDate = slotDate || todayStr;
    const hours = period === 'morning' ? ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] : ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

    for (const time of hours) {
      const startIso = new Date(`${baseDate}T${time}:00.000Z`).toISOString();
      const endIso = new Date(new Date(startIso).getTime() + 30 * 60 * 1000).toISOString();
      await createSlotMock(authorId, startIso, endIso);
    }

    loadData();
    setLoading(false);
    setActionMessage({
      type: 'success',
      text: `Se han generado 6 bloques de 30 minutos para el turno ${period === 'morning' ? 'de la mañana' : 'de la tarde'}.`,
    });
  };

  // Eliminar slot no reservado
  const handleDeleteSlot = async (slotId: string) => {
    const success = await deleteSlotMock(slotId);
    if (success) {
      loadData();
      setActionMessage({
        type: 'info',
        text: 'Bloque de disponibilidad eliminado.',
      });
    }
  };

  // Exportar .ics
  const handleExportICS = (booking: BookingSessionItem) => {
    downloadICSFile({
      id: booking.id,
      title: `Mentoría con ${booking.readerName} - ${booking.articleTitle || 'Diálogo Clínico'}`,
      startTime: booking.startTime,
      endTime: booking.endTime,
      authorName: author.fullName,
      authorEmail: author.email,
      readerName: booking.readerName,
      readerEmail: booking.readerEmail,
      articleTitle: booking.articleTitle,
      notes: booking.notes,
      virtualRoomUrl: `https://anamnesis.com/sala-virtual/${booking.id}`,
    });
  };

  // Confirmar cancelación atómica con validación de 2 horas
  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);

    const res = await cancelBookingAtomicMock(cancelModalBooking.id, authorId);
    setCancelling(false);
    setCancelModalBooking(null);

    if (res.success) {
      setActionMessage({
        type: 'success',
        text: res.message,
      });
      loadData();
    } else {
      setActionMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-background pb-24">
      {/* Top Header */}
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="container mx-auto max-w-6xl px-3 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 min-h-[44px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] gap-1 bg-background">
              <Globe className="w-3 h-3 text-primary" /> Huso del Autor: {author.timezone}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-3 sm:px-6 pt-6 sm:pt-10 space-y-8">
        {/* Author Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar src={author.avatarUrl} fallback="JS" className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-primary/40 shrink-0" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-xl sm:text-2xl font-bold">{author.fullName}</h1>
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px]">
                  Autor & Tutor Clínico
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{author.specialty} • {author.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link href="/agenda">
              <Button variant="outline" className="min-h-[44px] text-xs gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-primary" /> Ver Vista de Lectores
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Feedback Alert */}
        {actionMessage && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
              actionMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                : actionMessage.type === 'error'
                ? 'bg-destructive/10 border-destructive/30 text-destructive'
                : 'bg-primary/10 border-primary/30 text-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs: "Mi Día" vs "Gestión de Disponibilidad" */}
        <div className="flex border-b border-border/60 gap-2 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('my-day')}
            className={`flex items-center gap-2 min-h-[44px] px-4 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'my-day'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mi Día (Sesiones de Hoy: {todaySessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('manage-slots')}
            className={`flex items-center gap-2 min-h-[44px] px-4 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'manage-slots'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Gestión de Disponibilidad (Bloques de 30 min)</span>
          </button>
        </div>

        {/* TAB 1: MI DÍA (SESIONES DE HOY) */}
        {activeTab === 'my-day' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  Agenda de la Jornada
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sesiones de 30 minutos programadas para hoy con lectores y colegas.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{todaySessions.filter((s) => s.status === 'confirmed').length} confirmadas</span>
                <span>•</span>
                <span>{todaySessions.filter((s) => s.status === 'cancelled').length} canceladas</span>
              </div>
            </div>

            {todaySessions.length === 0 ? (
              <Card className="p-8 text-center space-y-3">
                <CalendarCheck className="w-10 h-10 mx-auto text-muted-foreground/60" />
                <div className="font-serif font-bold text-base">No tienes sesiones programadas para hoy</div>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Configura tus bloques de 30 minutos en la pestaña "Gestión de Disponibilidad" para que los lectores puedan agendar citas contigo.
                </p>
                <Button
                  onClick={() => setActiveTab('manage-slots')}
                  className="min-h-[44px] text-xs font-medium gap-2 mt-2 bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" /> Configurar Nuevos Horarios
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {todaySessions.map((session) => {
                  const isConfirmed = session.status === 'confirmed';
                  const cancelValidation = validateCancellationRule(session.startTime);

                  return (
                    <Card
                      key={session.id}
                      className={`transition shadow-sm flex flex-col justify-between ${
                        isConfirmed
                          ? 'border-primary/40 bg-card'
                          : 'border-border/40 bg-muted/20 opacity-75'
                      }`}
                    >
                      <CardHeader className="p-5 pb-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={isConfirmed ? 'default' : 'secondary'}
                            className={`text-[10px] ${
                              isConfirmed
                                ? 'bg-emerald-600 text-white'
                                : 'bg-muted text-muted-foreground line-through'
                            }`}
                          >
                            {isConfirmed ? '● Confirmada (30 min)' : '✕ Cancelada'}
                          </Badge>

                          <span className="text-xs font-bold text-primary font-mono">
                            {formatTimeRangeInZone(session.startTime, session.endTime, author.timezone)}
                          </span>
                        </div>

                        {/* Reader Info */}
                        <div className="flex items-start gap-3 pt-2">
                          <Avatar src={session.readerAvatar} fallback="SV" className="w-10 h-10 border shrink-0" />
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground truncate">
                              {session.readerName}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {session.readerEmail}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-5 pt-0 space-y-4">
                        {/* Topic / Linked Article */}
                        {session.articleTitle && (
                          <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1 border border-border/40">
                            <div className="text-[10px] uppercase font-semibold text-primary flex items-center gap-1">
                              <FileText className="w-3 h-3" /> Manuscrito de Referencia:
                            </div>
                            <div className="font-serif font-medium text-foreground line-clamp-2">
                              {session.articleTitle}
                            </div>
                          </div>
                        )}

                        {session.notes && (
                          <p className="text-xs text-muted-foreground italic font-serif bg-card p-2.5 rounded border border-border/30">
                            «{session.notes}»
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/40">
                          <div className="flex items-center gap-1.5">
                            {/* Exportar .ics */}
                            <Button
                              variant="outline"
                              onClick={() => handleExportICS(session)}
                              className="min-h-[44px] text-xs font-medium gap-1.5 px-3"
                              title="Descargar archivo .ics para Google / Apple Calendar"
                            >
                              <Download className="w-3.5 h-3.5" /> .ics
                            </Button>

                            {/* Cancelar Sesión (con validación de 2 horas) */}
                            {isConfirmed && (
                              <Button
                                variant="ghost"
                                onClick={() => setCancelModalBooking(session)}
                                className="min-h-[44px] text-xs font-medium text-destructive hover:bg-destructive/10 px-3"
                              >
                                Cancelar
                              </Button>
                            )}
                          </div>

                          {isConfirmed && (
                            <Button
                              className="min-h-[44px] text-xs font-medium gap-1.5 bg-primary hover:bg-primary/90 px-4"
                            >
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

        {/* TAB 2: GESTIÓN DE DISPONIBILIDAD */}
        {activeTab === 'manage-slots' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Slot Creation Form */}
            <Card className="shadow-sm">
              <CardHeader className="p-5 sm:p-6 pb-3">
                <CardTitle className="font-serif text-lg font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Agregar Nuevo Bloque de Disponibilidad (30 min)
                </CardTitle>
                <CardDescription className="text-xs">
                  Los bloques se publican automáticamente con una duración estricta de 30 minutos.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 pt-0 space-y-5">
                <form onSubmit={handleCreateSlot} className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Fecha</label>
                    <Input
                      type="date"
                      value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                      className="min-h-[44px] text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Hora de Inicio (UTC / Huso Local)</label>
                    <Input
                      type="time"
                      value={slotStartTime}
                      onChange={(e) => setSlotStartTime(e.target.value)}
                      className="min-h-[44px] text-xs"
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="submit"
                      disabled={creating}
                      className="w-full min-h-[44px] text-xs font-medium bg-primary hover:bg-primary/90 gap-1.5"
                    >
                      {creating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Agregar Bloque
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Batch Generator */}
                <div className="p-4 rounded-xl border border-primary/20 bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-foreground">Generador Rápido por Lotes (30 min c/u):</div>
                    <div className="text-muted-foreground text-[11px]">
                      Genera bloques consecutivos para la fecha seleccionada ({slotDate}).
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => handleBatchGenerate('morning')}
                      className="min-h-[44px] text-xs font-medium"
                    >
                      Turno Mañana (09:00 - 12:00)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => handleBatchGenerate('afternoon')}
                      className="min-h-[44px] text-xs font-medium"
                    >
                      Turno Tarde (15:00 - 18:00)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Slots List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold">
                  Bloques Configurados ({slots.length})
                </h3>
                <span className="text-xs text-muted-foreground">
                  {slots.filter((s) => !s.isBooked).length} libres para reserva
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {slots.map((slot) => {
                  const dateStr = formatInTimezone(slot.startTime, author.timezone, {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  });
                  const timeRangeStr = formatTimeRangeInZone(slot.startTime, slot.endTime, author.timezone);

                  return (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs transition ${
                        slot.isBooked
                          ? 'bg-muted/40 border-border/60 opacity-80'
                          : 'bg-card border-primary/30 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-foreground capitalize">{dateStr}</div>
                        <div className="font-mono text-primary font-bold">{timeRangeStr}</div>
                        <div className="text-[10px]">
                          {slot.isBooked ? (
                            <Badge variant="secondary" className="text-[9px] bg-amber-500/10 text-amber-600">
                              ● Reservado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] text-emerald-600 border-emerald-500/30">
                              ✓ Disponible
                            </Badge>
                          )}
                        </div>
                      </div>

                      {!slot.isBooked && (
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                          title="Eliminar este bloque"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Modal (Enforces 2-Hour Rule) */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="font-serif font-bold text-base text-destructive flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Cancelar Sesión de 30 Minutos
              </div>
              <button
                onClick={() => setCancelModalBooking(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-foreground">
                ¿Estás seguro de que deseas cancelar la sesión con <strong>{cancelModalBooking.readerName}</strong>?
              </p>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                <div className="font-semibold text-foreground">Horario:</div>
                <div className="font-mono text-primary">
                  {formatTimeRangeInZone(cancelModalBooking.startTime, cancelModalBooking.endTime, author.timezone)}
                </div>
              </div>

              {/* 2-Hour Rule Check Result */}
              {(() => {
                const rule = validateCancellationRule(cancelModalBooking.startTime);
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
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <Button
                variant="outline"
                onClick={() => setCancelModalBooking(null)}
                className="min-h-[44px] text-xs font-medium"
              >
                Volver
              </Button>
              <Button
                variant="destructive"
                disabled={!validateCancellationRule(cancelModalBooking.startTime).canCancel || cancelling}
                onClick={handleConfirmCancel}
                className="min-h-[44px] text-xs font-medium"
              >
                {cancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
