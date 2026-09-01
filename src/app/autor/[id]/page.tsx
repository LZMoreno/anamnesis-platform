import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Globe,
  Mail,
  MapPin,
  PenTool,
  Shield,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { getAuthorById, getArticlesByAuthorId, INITIAL_CIRCLES } from '@/lib/data/mock-db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface AuthorPageProps {
  params: {
    id: string;
  };
}

export default function AuthorProfilePage({ params }: AuthorPageProps) {
  const author = getAuthorById(params.id);

  if (!author) {
    notFound();
  }

  const publishedArticles = getArticlesByAuthorId(author.id);
  const totalReadingMinutes = publishedArticles.reduce(
    (acc, cur) => acc + cur.readingTimeMin,
    0
  );

  // Determinar círculos en los que participa
  const authorCircleSlugs = Array.from(
    new Set(publishedArticles.map((a) => a.circleSlug))
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'editor':
        return (
          <Badge className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 px-3 py-1 text-xs">
            <Shield className="w-3.5 h-3.5" /> Editor en Jefe
          </Badge>
        );
      case 'author':
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 px-3 py-1 text-xs">
            <PenTool className="w-3.5 h-3.5" /> Autor Principal
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
            <BookOpen className="w-3.5 h-3.5" /> Lector / Investigador
          </Badge>
        );
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-20">
      {/* Top Header Navigation */}
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="container mx-auto max-w-5xl px-3 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 min-h-[44px] text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Portada
          </Link>
          <span className="text-muted-foreground text-xs hidden sm:inline">
            Perfil Público Verificado
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-3 sm:px-6 pt-8 sm:pt-12 space-y-10">
        {/* Author Bio Header Card */}
        <div className="relative rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <Avatar
              src={author.avatarUrl}
              fallback={author.fullName.substring(0, 2).toUpperCase()}
              className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-primary/20 shadow-md shrink-0"
            />

            <div className="space-y-3 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {author.fullName}
                  </h1>
                  <p className="text-sm font-medium text-primary mt-0.5">
                    {author.specialty}
                  </p>
                </div>
                <div className="self-center sm:self-start">
                  {getRoleBadge(author.role)}
                </div>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-serif">
                {author.bio}
              </p>

              {/* Meta information: Location, Timezone, Member since */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground/80" />
                  {author.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground/80" />
                  {author.timezone}
                </span>
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-muted-foreground/80" />
                  Miembro desde {author.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 pt-4 border-t border-border/40">
            <Link href={`mailto:${author.email}`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto min-h-[44px] gap-2 text-xs font-medium"
              >
                <Mail className="w-4 h-4" /> Contactar al Autor
              </Button>
            </Link>
            <Link href="/agenda" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto min-h-[44px] gap-2 text-xs font-medium bg-primary hover:bg-primary/90">
                <Calendar className="w-4 h-4" /> Agendar Diálogo Clínico / Mentoría
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="text-center p-4">
            <CardHeader className="p-2 pb-0">
              <CardDescription className="text-xs">
                Obras Publicadas
              </CardDescription>
              <CardTitle className="text-3xl font-serif font-bold text-foreground">
                {publishedArticles.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-1 text-[11px] text-muted-foreground">
              Ensayos y crónicas revisadas por pares
            </CardContent>
          </Card>

          <Card className="text-center p-4">
            <CardHeader className="p-2 pb-0">
              <CardDescription className="text-xs">
                Tiempo de Lectura Total
              </CardDescription>
              <CardTitle className="text-3xl font-serif font-bold text-primary">
                {totalReadingMinutes} min
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-1 text-[11px] text-muted-foreground">
              Contenido reflexivo de libre acceso
            </CardContent>
          </Card>

          <Card className="text-center p-4">
            <CardHeader className="p-2 pb-0">
              <CardDescription className="text-xs">
                Círculos de Colaboración
              </CardDescription>
              <CardTitle className="text-3xl font-serif font-bold text-amber-500">
                {authorCircleSlugs.length || 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-1 text-[11px] text-muted-foreground">
              Mesas de redacción activas
            </CardContent>
          </Card>
        </div>

        {/* Published Works Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/40">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Obras y Ensayos Publicados
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Listado cronológico de textos disponibles en la plataforma Anamnesis.
              </p>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {publishedArticles.length} artículos encontrados
            </span>
          </div>

          {publishedArticles.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground space-y-2">
              <BookOpen className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-sm font-medium">No hay obras publicadas disponibles actualmente.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {publishedArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/circulo/${art.circleSlug}/articulos/${art.slug}`}
                  className="group block"
                >
                  <Card className="h-full flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-primary/50 group-hover:-translate-y-0.5">
                    <CardHeader className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <Badge
                          variant="secondary"
                          className="font-normal text-[11px] bg-primary/10 text-primary border-transparent"
                        >
                          {art.circleName}
                        </Badge>
                        <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
                          <Clock className="w-3 h-3" /> {art.readingTimeMin} min
                        </span>
                      </div>

                      <CardTitle className="font-serif text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                        {art.title}
                      </CardTitle>

                      <CardDescription className="text-xs leading-relaxed line-clamp-3">
                        {art.excerpt}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 pt-0">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {art.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground">
                        <span>{art.createdAt}</span>
                        <span className="text-primary font-medium group-hover:underline flex items-center gap-1">
                          Leer ensayo <ArrowLeft className="w-3 h-3 rotate-180" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Participating Circles Section */}
        {authorCircleSlugs.length > 0 && (
          <section className="space-y-4 pt-4">
            <h3 className="font-serif text-xl font-bold text-foreground">
              Círculos Editoriales Activos
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {authorCircleSlugs.map((slug) => {
                const circle = INITIAL_CIRCLES[slug];
                if (!circle) return null;
                return (
                  <Link key={slug} href={`/circulo/${slug}`} className="group">
                    <Card className="p-4 transition-all hover:border-primary/40">
                      <div className="space-y-2">
                        <div className="font-serif font-bold text-sm group-hover:text-primary transition-colors">
                          {circle.name}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {circle.description}
                        </p>
                        <div className="text-[11px] text-primary font-medium pt-1">
                          Explorar círculo →
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
