import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Feather, Layers, ShieldCheck, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

const mockCircles = [
  {
    name: 'Ensayo Médico',
    slug: 'ensayo-medico',
    description: 'Reflexiones clínicas, fenomenología del cuerpo enfermo y la anamnesis como puente humanista.',
    cover: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    count: '4 Ensayos',
    editor: 'Elena Rocafuerte',
  },
  {
    name: 'Crónica',
    slug: 'cronica',
    description: 'Relatos de no-ficción, periodismo narrativo y cartografías de la memoria urbana.',
    cover: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&auto=format&fit=crop&q=80',
    count: '6 Crónicas',
    editor: 'Elena Rocafuerte',
  },
  {
    name: 'Reseña Literaria',
    slug: 'resena-literaria',
    description: 'Análisis riguroso y crítica de novedades editoriales canónicas e independientes.',
    cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
    count: '8 Reseñas',
    editor: 'Elena Rocafuerte',
  },
];

const mockArticles = [
  {
    title: 'El peso de la palabra no dicha: Apuntes sobre la anamnesis en urgencias',
    slug: 'el-peso-de-la-palabra-no-dicha',
    circleSlug: 'ensayo-medico',
    circleName: 'Ensayo Médico',
    author: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    excerpt: 'En la guardia nocturna, el silencio de un paciente suele ser más elocuente que cualquier estudio tomográfico. La escucha como el diagnóstico más riguroso.',
    readingTime: '7 min',
    tags: ['Medicina Narrativa', 'Bioética', 'Guardias'],
    date: 'Hace 3 días',
  },
  {
    title: 'Madrugadas en el tranvía fantasma: Los últimos maquinistas de la estación sur',
    slug: 'madrugadas-en-el-tranvia-fantasma',
    circleSlug: 'cronica',
    circleName: 'Crónica',
    author: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    excerpt: 'A las cuatro y cuarto de la madrugada, los rieles de la terminal sur emiten un chirrido metálico que parece venir de otro siglo. Carlos limpia el parabrisas empañado...',
    readingTime: '9 min',
    tags: ['Crónica Urbana', 'Memoria', 'Oficios'],
    date: 'Hace 5 días',
  },
  {
    title: 'La sintaxis del duelo en la narrativa de María Luisa Bombal',
    slug: 'la-sintaxis-del-duelo-maria-luisa-bombal',
    circleSlug: 'resena-literaria',
    circleName: 'Reseña Literaria',
    author: 'Elena Rocafuerte',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    excerpt: 'En La amortajada (1938), María Luisa Bombal instaura una fenomenología sensorial de la muerte donde la difunta observa, escucha y juzga con una lucidez vedada a los vivos.',
    readingTime: '6 min',
    tags: ['Crítica Literaria', 'Narrativa', 'Estética'],
    date: 'Hace 8 días',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/30 via-background to-background py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4 text-center space-y-6">
          <Badge variant="outline" className="gap-1.5 py-1 px-3.5 text-xs rounded-full border-primary/30 text-primary bg-primary/5">
            <Sparkles className="w-3.5 h-3.5" />
            Curaduría Editorial & Humanismo
          </Badge>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            La memoria que antecede al diagnóstico y la palabra.
          </h1>
          
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Una plataforma donde el ensayo clínico, la crónica urbana y la crítica literaria convergen bajo el rigor del pensamiento crítico y la curaduría editorial.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link href="/circulo/ensayo-medico">
              <Button size="lg" className="gap-2 rounded-full px-6">
                Explorar Círculos <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/agenda">
              <Button size="lg" variant="outline" className="rounded-full px-6">
                Agendar Mentoría
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Círculos Editoriales */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Círculos Editoriales
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Comunidades temáticas supervisadas por editores expertos.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">3 círculos activos</span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {mockCircles.map((circle) => (
            <Link key={circle.slug} href={`/circulo/${circle.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 group-hover:-translate-y-1">
                <div className="aspect-[16/9] w-full overflow-hidden bg-muted relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={circle.cover}
                    alt={circle.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-background/80 text-foreground backdrop-blur text-xs">
                      {circle.count}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                    {circle.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                    {circle.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground flex items-center justify-between pt-0">
                  <span>Editora: {circle.editor}</span>
                  <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1 text-primary" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Artículos Destacados */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Manuscritos y Ensayos Recientes
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Lecturas completas en prosa en español de libre acceso.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {mockArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/circulo/${article.circleSlug}/articulos/${article.slug}`}
              className="group flex flex-col"
            >
              <Card className="flex-1 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-primary/40">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="secondary" className="font-normal text-[11px]">
                      {article.circleName}
                    </Badge>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" /> {article.readingTime}
                    </span>
                  </div>
                  <CardTitle className="font-serif text-lg leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-xs leading-relaxed">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-border/40 text-xs">
                    <Avatar src={article.authorAvatar} fallback="JS" className="w-7 h-7" />
                    <div>
                      <div className="font-medium text-foreground">{article.author}</div>
                      <div className="text-[10px] text-muted-foreground">{article.date}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
