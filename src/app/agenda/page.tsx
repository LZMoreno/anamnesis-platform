import { Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

export default function AgendaPage() {
  const slots = [
    {
      id: '1',
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
      author: 'Dr. Julián Sotomayor',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      date: 'Viernes, 4 de Septiembre',
      time: '10:00 - 11:00 UTC',
      isBooked: false,
      topic: 'Revisión Metodológica de Crónica',
    },
    {
      id: '3',
      author: 'Elena Rocafuerte',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      date: 'Lunes, 7 de Septiembre',
      time: '17:00 - 18:00 UTC',
      isBooked: false,
      topic: 'Curaduría y Estructura Narrativa',
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 space-y-10">
      <div className="space-y-3">
        <Badge variant="outline" className="text-xs">
          Sistema de Agendamiento
        </Badge>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">
          Agenda de Asesorías & Diálogo Clínico
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Reserva bloques de tiempo individuales con autores y editores para revisión de manuscritos o consultas teóricas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {slots.map((slot) => (
          <Card key={slot.id} className="flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={slot.isBooked ? 'secondary' : 'default'} className="text-[10px]">
                  {slot.isBooked ? 'Reservado' : 'Disponible'}
                </Badge>
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <CardTitle className="font-serif text-base">{slot.topic}</CardTitle>
              <CardDescription className="text-xs">
                {slot.date} • {slot.time}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center gap-3 pt-3 border-t border-border/40 text-xs">
                <Avatar src={slot.authorAvatar} fallback="AU" className="w-8 h-8" />
                <div>
                  <div className="font-medium text-foreground">{slot.author}</div>
                  <div className="text-[10px] text-muted-foreground">Autor / Mentor</div>
                </div>
              </div>

              {slot.isBooked ? (
                <div className="rounded bg-muted/40 p-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {slot.bookedBy}
                </div>
              ) : (
                <Button size="sm" className="w-full text-xs">
                  Reservar este Bloque
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
