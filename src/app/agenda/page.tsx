import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, CheckCircle, UserCheck, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

export default function AgendaPage() {
  const slots = [
    {
      id: '1',
      authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
      author: 'Dr. Julián Sotomayor',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      date: 'Jueves, 3 de Septiembre',
      time: '16:00 - 17:00 UTC',
      isBooked: true,
      bookedBy: 'Sofía Valenzuela (Confirmada)',
      topic: 'Tutoría de Ensayo Clínico y Narrativa',
    },
    {
      id: '2',
      authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
      author: 'Dr. Julián Sotomayor',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      date: 'Viernes, 4 de Septiembre',
      time: '10:00 - 11:00 UTC',
      isBooked: false,
      topic: 'Revisión Metodológica de Crónica',
    },
    {
      id: '3',
      authorId: 'cccccccc-3333-4333-c333-cccccccccccc',
      author: 'Elena Rocafuerte',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      date: 'Lunes, 7 de Septiembre',
      time: '17:00 - 18:00 UTC',
      isBooked: false,
      topic: 'Curaduría y Estructura Narrativa',
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-20">
      {/* Header Breadcrumb */}
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="container mx-auto max-w-5xl px-3 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 min-h-[44px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
          <span className="text-muted-foreground">Mentorías & Asesorías Clínicas</span>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-3 sm:px-6 pt-8 sm:pt-12 space-y-10">
        <div className="space-y-3">
          <Badge variant="outline" className="text-xs">
            Sistema de Agendamiento
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Agenda de Asesorías & Diálogo Clínico
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Reserva bloques de tiempo individuales con autores y editores para revisión de manuscritos, bioética o consultas teóricas.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {slots.map((slot) => (
            <Card key={slot.id} className="flex flex-col justify-between shadow-sm">
              <CardHeader className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={slot.isBooked ? 'secondary' : 'default'} className="text-[10px]">
                    {slot.isBooked ? 'Reservado' : 'Disponible'}
                  </Badge>
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <CardTitle className="font-serif text-base sm:text-lg">{slot.topic}</CardTitle>
                <CardDescription className="text-xs">
                  {slot.date} • {slot.time}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                <Link
                  href={`/autor/${slot.authorId}`}
                  className="flex items-center gap-3 pt-3 border-t border-border/40 text-xs group min-h-[44px]"
                >
                  <Avatar src={slot.authorAvatar} fallback="AU" className="w-9 h-9" />
                  <div>
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {slot.author}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Ver perfil de autor →</div>
                  </div>
                </Link>

                {slot.isBooked ? (
                  <div className="rounded-lg bg-muted/50 p-2.5 text-[11px] text-muted-foreground flex items-center gap-2 min-h-[44px]">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{slot.bookedBy}</span>
                  </div>
                ) : (
                  <Button className="w-full min-h-[44px] text-xs font-medium bg-primary hover:bg-primary/90">
                    Reservar este Bloque
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
