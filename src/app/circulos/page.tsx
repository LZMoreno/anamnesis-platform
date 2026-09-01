import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Feather,
  Layers,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { INITIAL_CIRCLES } from '@/lib/data/mock-db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

export const metadata = {
  title: 'Círculos Editoriales • Anamnesis',
  description:
    'Explora los distintos círculos de literatura, ensayo médico y crónica narrativa que conviven en Anamnesis.',
};

export default function CirclesDirectoryPage() {
  const circlesList = Object.values(INITIAL_CIRCLES);

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-20">
      {/* Header Banner */}
      <div className="border-b border-border/40 bg-muted/20 py-8 sm:py-12">
        <div className="container mx-auto max-w-6xl px-3 sm:px-6 space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>

          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs px-2.5 py-0.5">
              Multi-Comunidad
            </Badge>
            <span className="text-xs text-muted-foreground">• Círculos Autónomos</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Círculos Editoriales de Anamnesis
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Cada círculo es una comunidad editorial autónoma con su propia línea curatorial, autores invitados, manifiesto y dirección web independiente.
          </p>
        </div>
      </div>

      {/* Circles Grid */}
      <div className="container mx-auto max-w-6xl px-3 sm:px-6 mt-8 sm:mt-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {circlesList.map((circle) => (
            <Card
              key={circle.id}
              className="overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/40 group"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={circle.coverUrl}
                    alt={circle.name}
                    className="h-full w-full object-cover brightness-[0.75] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <Badge className="bg-background/80 backdrop-blur text-[11px] font-mono">
                      /circulo/{circle.slug}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-1.5 font-medium drop-shadow">
                      <Users className="w-3.5 h-3.5" />
                      <span>{circle.memberCount} Miembros</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium drop-shadow">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{circle.articleCount} Manuscritos</span>
                    </div>
                  </div>
                </div>

                <CardHeader className="p-5 pb-3">
                  <CardTitle className="font-serif text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors">
                    {circle.name}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                    {circle.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  {/* Manifesto Quote */}
                  <div className="rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground font-serif italic border-l-2 border-primary/60">
                    &ldquo;{circle.manifesto.substring(0, 110)}...&rdquo;
                  </div>

                  {/* Editor Info */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <Avatar
                      src={circle.editorAvatar}
                      fallback="ED"
                      className="w-8 h-8 border border-primary/20 shrink-0"
                    />
                    <div className="text-[11px]">
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <Shield className="w-3 h-3 text-amber-500" />
                        {circle.editorName}
                      </div>
                      <div className="text-muted-foreground">Editora General</div>
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-5 pt-0 border-t border-border/40 mt-4 flex items-center justify-between gap-2">
                <Link
                  href={`/circulo/${circle.slug}`}
                  className="w-full"
                >
                  <Button
                    className="w-full min-h-[44px] text-xs gap-1.5 font-medium bg-primary hover:bg-primary/90"
                  >
                    <span>Entrar al Círculo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
