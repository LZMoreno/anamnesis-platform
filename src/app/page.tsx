'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Calendar,
  Clock,
  Compass,
  Feather,
  Layers,
  Search,
  Shield,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ArticleSearchFilter } from '@/components/articles/article-search-filter';
import {
  INITIAL_CIRCLES,
  INITIAL_ARTICLES,
  INITIAL_AUTHORS,
  isArticleBookmarked,
  toggleBookmarkMock,
} from '@/lib/data/mock-db';

export default function HomePage() {
  const circles = Object.values(INITIAL_CIRCLES);
  const articles = INITIAL_ARTICLES.filter((a) => a.status === 'published');
  const featuredAuthors = Object.values(INITIAL_AUTHORS).filter((a) => a.role !== 'reader');

  const [savedIds, setSavedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const bookmarked = articles.filter((a) => isArticleBookmarked(a.id)).map((a) => a.id);
    setSavedIds(bookmarked);
  }, []);

  const handleToggleBookmark = async (articleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const res = await toggleBookmarkMock(articleId);
    if (res.isBookmarked) {
      setSavedIds((prev) => [...prev, articleId]);
    } else {
      setSavedIds((prev) => prev.filter((id) => id !== articleId));
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-12 sm:space-y-16 pb-20">
      {/* 1. Hero Section: La Experiencia Pública de Lectura */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/30 via-background to-background py-14 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-5xl px-3 sm:px-6 text-center space-y-6">
          <Badge
            variant="outline"
            className="gap-1.5 py-1.5 px-3.5 text-xs rounded-full border-primary/30 text-primary bg-primary/5 shadow-sm inline-flex items-center"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Curaduría Editorial & Humanismo
          </Badge>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            La memoria que antecede al diagnóstico y la palabra.
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-muted-foreground leading-relaxed">
            Una plataforma donde el ensayo clínico, la crónica urbana y la crítica literaria convergen bajo el rigor de la curaduría editorial y el diálogo comunitario.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/circulo/ensayo-medico" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto min-h-[44px] gap-2 rounded-full px-6 text-xs sm:text-sm font-medium bg-primary hover:bg-primary/90"
              >
                Explorar Círculos <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/explorar" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto min-h-[44px] gap-2 rounded-full px-6 text-xs sm:text-sm font-medium"
              >
                <Compass className="w-4 h-4" /> Buscar en Biblioteca
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Círculos Editoriales Autónomos */}
      <section className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/40 pb-3">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Círculos Editoriales
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Comunidades temáticas con dirección propia, autores invitados y lectores activos.
            </p>
          </div>
          <Link href="/circulos" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            Ver los 3 Círculos →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {circles.map((circle) => (
            <Link key={circle.slug} href={`/circulo/${circle.slug}`} className="group block">
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 group-hover:-translate-y-1 flex flex-col justify-between border-border/60">
                <div>
                  <div className="aspect-[16/9] w-full overflow-hidden bg-muted relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={circle.coverUrl}
                      alt={circle.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-background/85 text-foreground backdrop-blur text-xs font-semibold">
                        {circle.memberCount} Miembros
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="p-5 space-y-2">
                    <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                      {circle.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {circle.description}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardContent className="p-5 pt-0 text-xs text-muted-foreground flex items-center justify-between border-t border-border/40 mt-2">
                  <span className="font-medium text-foreground">Editora: {circle.editorName}</span>
                  <span className="text-primary font-medium flex items-center gap-1 min-h-[44px]">
                    Entrar <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Búsqueda y Filtros en Tiempo Real (Debounce 300ms + Filtros por Tema y Autor) */}
      <section className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-border/40 pb-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Biblioteca de Manuscritos & Ensayos
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Búsqueda instantánea con filtros combinados por autor, temas/etiquetas, círculo y artículos guardados.
          </p>
        </div>

        {/* Componente de Búsqueda & Filtro */}
        <ArticleSearchFilter articles={articles} />
      </section>

      {/* 4. Perfiles Públicos de Autores y Ensayistas */}
      <section className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/40 pb-3">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Voces & Ensayistas Destacados
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Perfiles públicos con biografía, obra publicada y sesiones de diálogo de 30 minutos.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {featuredAuthors.map((author) => (
            <Link key={author.id} href={`/autor/${author.id}`} className="group block">
              <Card className="h-full p-5 sm:p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-md border-border/60">
                <div className="flex items-start gap-4">
                  <Avatar
                    src={author.avatarUrl}
                    fallback={author.fullName.substring(0, 2).toUpperCase()}
                    className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-border/60 shrink-0 group-hover:border-primary transition-colors"
                  />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="font-serif font-bold text-base sm:text-lg group-hover:text-primary transition-colors">
                        {author.fullName}
                      </div>
                      {author.role === 'editor' ? (
                        <Badge className="bg-amber-600 hover:bg-amber-700 text-white text-[10px]">
                          <Shield className="w-3 h-3 mr-1" /> Editor
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px]">
                          <Feather className="w-3 h-3 mr-1" /> Autor
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-primary font-medium">{author.specialty}</p>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-serif">
                      {author.bio}
                    </p>

                    <div className="text-[11px] text-primary font-medium pt-2 flex items-center gap-1 min-h-[44px]">
                      Ver biografía y obras publicadas →
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
