import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Shield, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface CirclePageProps {
  params: {
    slug: string;
  };
}

const circlesData: Record<string, {
  name: string;
  description: string;
  cover: string;
  editor: string;
  editorBio: string;
  editorAvatar: string;
  membersCount: number;
  articles: Array<{
    title: string;
    slug: string;
    excerpt: string;
    author: string;
    authorAvatar: string;
    readingTime: string;
    status: 'published' | 'draft';
    tags: string[];
    date: string;
  }>;
}> = {
  'ensayo-medico': {
    name: 'Ensayo Médico',
    description: 'Reflexiones clínicas, fenomenología del cuerpo enfermo, dilemas de bioética y la anamnesis como puente entre ciencia y humanismo.',
    cover: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    editor: 'Elena Rocafuerte',
    editorBio: 'Editora en jefe y curadora de ensayos de bioética y narrativa clínica.',
    editorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    membersCount: 42,
    articles: [
      {
        title: 'El peso de la palabra no dicha: Apuntes sobre la anamnesis en urgencias',
        slug: 'el-peso-de-la-palabra-no-dicha',
        excerpt: 'En la guardia nocturna, el silencio de un paciente suele ser más elocuente que cualquier estudio tomográfico. La escucha como el diagnóstico más riguroso.',
        author: 'Dr. Julián Sotomayor',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        readingTime: '7 min',
        status: 'published',
        tags: ['Medicina Narrativa', 'Bioética', 'Guardias'],
        date: '1 de Septiembre, 2026',
      },
    ],
  },
  'cronica': {
    name: 'Crónica',
    description: 'Relatos de no-ficción, periodismo narrativo, cartografías de la memoria urbana y testimonios de la vida cotidiana en América Latina.',
    cover: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=1200&auto=format&fit=crop&q=80',
    editor: 'Elena Rocafuerte',
    editorBio: 'Crítica literaria y editora de relatos de no-ficción urbana.',
    editorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    membersCount: 68,
    articles: [
      {
        title: 'Madrugadas en el tranvía fantasma: Los últimos maquinistas de la estación sur',
        slug: 'madrugadas-en-el-tranvia-fantasma',
        excerpt: 'A las cuatro y cuarto de la madrugada, los rieles de la terminal sur emiten un chirrido metálico que parece venir de otro siglo...',
        author: 'Dr. Julián Sotomayor',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        readingTime: '9 min',
        status: 'published',
        tags: ['Crónica Urbana', 'Memoria', 'Oficios'],
        date: '28 de Agosto, 2026',
      },
    ],
  },
  'resena-literaria': {
    name: 'Reseña Literaria',
    description: 'Análisis riguroso, crítica de novedades editoriales y relecturas de obras canónicas hispanoamericanas bajo la mirada contemporánea.',
    cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80',
    editor: 'Elena Rocafuerte',
    editorBio: 'Crítica literaria y docente de literatura comparada.',
    editorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    membersCount: 89,
    articles: [
      {
        title: 'La sintaxis del duelo en la narrativa de María Luisa Bombal',
        slug: 'la-sintaxis-del-duelo-maria-luisa-bombal',
        excerpt: 'En La amortajada (1938), María Luisa Bombal instaura una fenomenología sensorial de la muerte donde la difunta observa, escucha y juzga.',
        author: 'Elena Rocafuerte',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        readingTime: '6 min',
        status: 'published',
        tags: ['Crítica Literaria', 'Narrativa', 'Estética'],
        date: '24 de Agosto, 2026',
      },
    ],
  },
};

export default function CirclePage({ params }: CirclePageProps) {
  const circle = circlesData[params.slug];

  if (!circle) {
    notFound();
  }

  return (
    <div className="pb-16">
      {/* Circle Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={circle.cover}
          alt={circle.name}
          className="h-full w-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute bottom-6 left-0 right-0">
          <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
              </Link>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                {circle.name}
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                {circle.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/circulo/${params.slug}/editor`}>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  Mesa Editorial
                </Button>
              </Link>
              <Button size="sm" className="gap-1.5 text-xs">
                <UserPlus className="w-3.5 h-3.5" />
                Unirse ({circle.membersCount})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Circle Content */}
      <div className="container mx-auto max-w-6xl px-4 mt-12 grid gap-8 md:grid-cols-3">
        {/* Main Feed */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <h2 className="font-serif text-xl font-semibold">Artículos Publicados</h2>
            <span className="text-xs text-muted-foreground">{circle.articles.length} textos</span>
          </div>

          <div className="space-y-4">
            {circle.articles.map((article) => (
              <Link
                key={article.slug}
                href={`/circulo/${params.slug}/articulos/${article.slug}`}
                className="block group"
              >
                <Card className="transition-all hover:border-primary/40 hover:shadow-sm">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.readingTime}
                      </span>
                      <span>{article.date}</span>
                    </div>
                    <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between pt-0 text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar src={article.authorAvatar} fallback="AU" className="w-6 h-6" />
                      <span className="text-muted-foreground">{article.author}</span>
                    </div>
                    <div className="flex gap-1">
                      {article.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" /> Curaduría y Edición
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <Avatar src={circle.editorAvatar} fallback="ER" className="w-12 h-12" />
                <div>
                  <div className="font-semibold text-foreground">{circle.editor}</div>
                  <div className="text-muted-foreground">Editora Responsable</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {circle.editorBio}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Normas del Círculo</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>• Los manuscritos son evaluados por pares antes de su publicación definitiva.</p>
              <p>• Toda cita clínica resguarda el anonimato estricto según estándares bioéticos.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
