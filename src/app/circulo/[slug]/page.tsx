'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Edit3,
  Feather,
  Plus,
  Shield,
  Sparkles,
  Tag,
  UserPlus,
  Users,
} from 'lucide-react';
import { getCircleBySlug, getArticlesByCircleSlug, INITIAL_ARTICLES } from '@/lib/data/mock-db';
import { ArticleSearchFilter } from '@/components/articles/article-search-filter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface CirclePageProps {
  params: {
    slug: string;
  };
}

export default function CirclePage({ params }: CirclePageProps) {
  const circle = getCircleBySlug(params.slug);

  if (!circle) {
    notFound();
  }

  const circleArticles = INITIAL_ARTICLES.filter((a) => a.circleSlug === params.slug && a.status === 'published');

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-20">
      {/* Circle Banner with Overlay */}
      <div className="relative h-72 sm:h-80 md:h-96 w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={circle.coverUrl}
          alt={circle.name}
          className="h-full w-full object-cover brightness-[0.65] transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 py-6">
          <div className="container mx-auto max-w-6xl px-3 sm:px-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Volver al Inicio
              </Link>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge className="bg-primary/90 text-primary-foreground text-xs px-2.5 py-0.5">
                  Círculo Editorial
                </Badge>
                <Badge variant="outline" className="bg-background/60 backdrop-blur text-xs">
                  {circle.memberCount} Miembros
                </Badge>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                {circle.name}
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
                {circle.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
              <Link href={`/circulo/${params.slug}/editor`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto min-h-[44px] gap-2 text-xs font-medium bg-background/80 backdrop-blur hover:bg-accent"
                >
                  <Shield className="w-4 h-4 text-amber-500" />
                  Mesa Editorial
                </Button>
              </Link>
              <Link href={`/circulo/${params.slug}/editor/members`} className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto min-h-[44px] gap-2 text-xs font-medium"
                >
                  <Users className="w-4 h-4" />
                  Gestionar Miembros
                </Button>
              </Link>
              <Button
                className="w-full sm:w-auto min-h-[44px] gap-2 text-xs font-medium bg-primary hover:bg-primary/90"
              >
                <UserPlus className="w-4 h-4" />
                Unirse al Círculo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Articles + Sidebar */}
      <div className="container mx-auto max-w-6xl px-3 sm:px-6 mt-8 sm:mt-12 grid gap-8 lg:grid-cols-3">
        {/* Articles Feed with Search & Filter */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Manuscritos & Artículos Publicados
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Búsqueda en tiempo real y filtrado de obras del círculo.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <ArticleSearchFilter articles={circleArticles} initialCircleSlug={params.slug} />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Editor Info Card with Link to Public Author Profile */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" /> Curaduría y Dirección
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <Avatar
                  src={circle.editorAvatar}
                  fallback="ER"
                  className="w-14 h-14 border border-primary/20 shrink-0"
                />
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-sm text-foreground">
                    {circle.editorName}
                  </div>
                  <div className="text-primary font-medium text-[11px]">
                    Editora General
                  </div>
                  <div className="text-muted-foreground text-[10px]">
                    Curadora de manuscritos
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed font-serif">
                Docente e investigadora de archivos testimoniales y memoria en Anamnesis.
              </p>

              <Link
                href={`/autor/${circle.editorId}`}
                className="block"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full min-h-[44px] text-xs gap-1.5 font-medium"
                >
                  Ver Perfil y Ensayos del Editor →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Circle Manifesto Card */}
          <Card className="bg-muted/20 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-serif font-bold flex items-center gap-2">
                <Feather className="w-4 h-4 text-primary" /> Manifiesto del Círculo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-3 leading-relaxed">
              <p>
                {circle.manifesto || circle.description}
              </p>
              <div className="rounded-lg bg-card p-3 border text-[11px] space-y-1">
                <div className="font-semibold text-foreground">¿Deseas enviar un manuscrito?</div>
                <p>Las colaboraciones son evaluadas por pares en un plazo máximo de 10 días hábiles.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
