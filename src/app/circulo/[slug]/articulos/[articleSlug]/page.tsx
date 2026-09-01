'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Heart,
  Share2,
  Sparkles,
  Type,
  User,
} from 'lucide-react';
import {
  INITIAL_ARTICLES,
  INITIAL_AUTHORS,
  INITIAL_CIRCLES,
  isArticleBookmarked,
  toggleBookmarkMock,
} from '@/lib/data/mock-db';
import { CommentThreadSection } from '@/components/comments/comment-thread-section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface ArticlePageProps {
  params: {
    slug: string;
    articleSlug: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article =
    INITIAL_ARTICLES.find(
      (a) => a.slug === params.articleSlug || a.circleSlug === params.slug
    ) || INITIAL_ARTICLES[0];

  const author = INITIAL_AUTHORS[article.authorId] || INITIAL_AUTHORS['bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb'];
  const circle = INITIAL_CIRCLES[article.circleSlug] || INITIAL_CIRCLES['ensayo-medico'];

  // Estados de lectura y tipografía
  const [readingProgress, setReadingProgress] = React.useState(0);
  const [fontSize, setFontSize] = React.useState<'base' | 'lg' | 'xl'>('lg');
  const [fontFamily, setFontFamily] = React.useState<'serif' | 'sans'>('serif');
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Rol simulado para moderación
  const [demoRole, setDemoRole] = React.useState<'reader' | 'author' | 'editor'>('reader');

  React.useEffect(() => {
    setIsBookmarked(isArticleBookmarked(article.id));

    // Detectar cookie o selector de rol
    const match = document.cookie.match(/anamnesis_demo_role=([^;]+)/);
    if (match) {
      setDemoRole(match[1] as any);
    }
  }, [article.id]);

  // Barra de progreso de lectura basada en scroll
  React.useEffect(() => {
    const updateProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / scrollHeight) * 100));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const handleToggleBookmark = async () => {
    const res = await toggleBookmarkMock(article.id);
    setIsBookmarked(res.isBookmarked);
    setToastMessage(
      res.isBookmarked
        ? '¡Guardado en tus lecturas! Puedes encontrarlo en tu lista de marcadores.'
        : 'Manuscrito eliminado de tus marcadores.'
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Enlace permanente copiado al portapapeles.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-24 bg-background">
      {/* Barra superior de progreso de lectura fija en el borde superior */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150 ease-out shadow-sm"
        style={{ width: `${readingProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Header Navigation & Reading Preferences (Sin solapamientos) */}
      <div className="border-b border-border/40 bg-muted/20 py-3 mb-4">
        <div className="container mx-auto max-w-4xl px-3 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href={`/circulo/${params.slug}`}
            className="flex items-center gap-1.5 min-h-[44px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a {circle.name}
          </Link>

          {/* Reading Controls Toolbar (Font Size & Typeface) */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-card p-1 rounded-lg border border-border/60 shadow-sm">
              <button
                onClick={() => setFontFamily(fontFamily === 'serif' ? 'sans' : 'serif')}
                className="px-2.5 py-1 min-h-[32px] rounded text-[11px] font-semibold text-muted-foreground hover:text-foreground transition"
                title="Alternar tipografía Serif / Sans"
              >
                {fontFamily === 'serif' ? 'Serif' : 'Sans'}
              </button>

              <span className="text-border">|</span>

              <button
                onClick={() => setFontSize(fontSize === 'base' ? 'lg' : fontSize === 'lg' ? 'xl' : 'base')}
                className="px-2.5 py-1 min-h-[32px] rounded text-[11px] font-semibold text-muted-foreground hover:text-foreground transition flex items-center gap-1"
                title="Ajustar tamaño de letra"
              >
                <Type className="w-3 h-3" />
                {fontSize === 'base' ? 'Normal' : fontSize === 'lg' ? 'Grande' : 'Max'}
              </button>
            </div>

            {/* Bookmark Action Button */}
            <Button
              variant={isBookmarked ? 'secondary' : 'outline'}
              onClick={handleToggleBookmark}
              className={`min-h-[44px] text-xs font-medium gap-1.5 px-3 transition ${
                isBookmarked ? 'bg-primary/15 border-primary/40 text-primary font-semibold' : ''
              }`}
              title={isBookmarked ? 'Guardado en marcadores' : 'Guardar para después'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Guardado' : 'Guardar'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-card border border-primary/40 shadow-2xl text-xs flex items-center gap-2.5 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <span className="text-foreground">{toastMessage}</span>
        </div>
      )}

      {/* Main Article Container con espacio superior limpio */}
      <article className="container mx-auto max-w-3xl px-3 sm:px-6 pt-4 sm:pt-6 space-y-8">
        {/* Article Header & Metadata */}
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/circulo/${article.circleSlug}`}>
              <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold hover:bg-muted py-1">
                {article.circleName}
              </Badge>
            </Link>

            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[11px] font-normal py-1">
                #{tag}
              </Badge>
            ))}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.2]">
            {article.title}
          </h1>

          <p className="font-serif text-lg sm:text-xl text-muted-foreground italic leading-relaxed border-l-2 border-primary/40 pl-4">
            {article.excerpt}
          </p>

          {/* Author Card & Reading Specs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-border/40">
            <Link href={`/autor/${article.authorId}`} className="flex items-center gap-3 group min-h-[44px]">
              <Avatar
                src={article.authorAvatar}
                fallback="AU"
                className="w-12 h-12 border border-border/60 group-hover:border-primary transition-colors"
              />
              <div>
                <div className="font-serif font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {article.authorName}
                </div>
                <div className="text-xs text-muted-foreground">{author?.specialty || 'Autor & Ensayista'}</div>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> {article.readingTimeMin} min de lectura
              </span>
              <span>•</span>
              <span>{article.createdAt}</span>
            </div>
          </div>
        </header>

        {/* Article Long-Form Typography (Tailwind Prose) */}
        <div
          className={`prose prose-lg dark:prose-invert max-w-none leading-relaxed transition-all ${
            fontFamily === 'serif' ? 'font-serif' : 'font-sans'
          } ${
            fontSize === 'base'
              ? 'text-base sm:text-lg'
              : fontSize === 'lg'
              ? 'text-lg sm:text-xl'
              : 'text-xl sm:text-2xl'
          }`}
        >
          <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-primary">
            En la guardia nocturna, el silencio de un paciente suele ser más elocuente que cualquier estudio tomográfico. La medicina moderna nos ha adiestrado para confiar ciegamente en el biomarcador y la imagen por resonancia magnética, relegando la conversación clínica a un formulario burocrático de quince minutos.
          </p>

          <p>
            Sin embargo, el término <em>anamnesis</em> proviene del griego ἀνάμνησις: rememoración, traer al presente lo que parecía olvidado. Cuando un enfermo cruza el umbral de urgencias con dolor torácico opresivo, su cuerpo narra una crisis biológica, pero su mirada casi siempre formula otra pregunta: ¿quién me sostendrá si esto no pasa?
          </p>

          {/* Book Citation Card embedded in Prose */}
          <div className="book-citation-card not-prose my-8 p-5 rounded-2xl border border-primary/20 bg-muted/20 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80"
              alt="La muerte de Iván Ilich"
              className="w-20 h-28 object-cover rounded-lg shadow-md shrink-0 border"
              loading="lazy"
            />
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">
                Cita Bibliográfica • Open Library
              </div>
              <h4 className="font-serif font-bold text-base text-foreground leading-snug">
                La muerte de Iván Ilich
              </h4>
              <div className="text-xs text-muted-foreground font-medium">Lev Tolstói (1886)</div>
              <p className="italic text-foreground/90 font-serif text-xs sm:text-sm my-1 border-l-2 border-primary/40 pl-3">
                «La historia de la vida de Iván Ilich era la más sencilla, la más corriente y la más terrible.»
              </p>
            </div>
          </div>

          <p>
            Recuerdo a don Mateo, un relojero de setenta y cuatro años con disnea progresiva. Sus gases arteriales eran limpios; su ecocardiograma mostraba apenas la rigidez propia de las décadas. No fue hasta que le pregunté por su taller que brotó la verdadera causa de su asfixia: hacía tres semanas había tenido que vender su última lupa de precisión para costear la pensión. El corazón humano no distingue entre la hipoxia tisular y el luto por el oficio perdido.
          </p>

          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-serif my-6">
            «Recuperar la escucha en el acto médico no es un capricho poético; es la forma más rigurosa de diagnóstico que conocemos.»
          </blockquote>

          <p>
            Si despojamos al acto clínico de su dimensión narrativa, convertimos los hospitales en factorías de reparación mecánica. La verdadera terapéutica comienza cuando el médico acepta sentarse al borde de la cama, guarda el estetoscopio por un instante y permite que el enfermo termine de contar su historia.
          </p>
        </div>

        {/* Action Bar: Bookmark, Share & Schedule Meeting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-8 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Button
              variant={isBookmarked ? 'secondary' : 'outline'}
              onClick={handleToggleBookmark}
              className={`min-h-[44px] gap-2 text-xs font-semibold ${
                isBookmarked ? 'text-primary bg-primary/10 border-primary/30' : ''
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary' : ''}`} />
              {isBookmarked ? 'En tus Marcadores' : 'Guardar para después'}
            </Button>

            <Button variant="ghost" onClick={handleShare} className="min-h-[44px] gap-2 text-xs font-medium">
              <Share2 className="w-4 h-4" /> Compartir
            </Button>
          </div>

          <Link href="/agenda" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto min-h-[44px] text-xs font-semibold bg-primary hover:bg-primary/90 gap-2">
              <Sparkles className="w-4 h-4" /> Agendar Tutoría de 30m con el Autor
            </Button>
          </Link>
        </div>

        {/* Author Bio Box */}
        <Card className="bg-muted/20 border-dashed rounded-2xl">
          <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <Avatar src={article.authorAvatar} fallback="AU" className="w-16 h-16 shrink-0 border" />
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="font-serif font-bold text-base">{article.authorName}</div>
                <Link
                  href={`/autor/${article.authorId}`}
                  className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1 justify-center sm:justify-start min-h-[44px]"
                >
                  <User className="w-3.5 h-3.5" /> Ver Perfil & Obras →
                </Link>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{author?.bio}</p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Threaded Comments Section with Realtime & Moderation */}
        <CommentThreadSection
          articleSlug={article.slug}
          articleTitle={article.title}
          authorEmail={author.email}
          circleSlug={article.circleSlug}
          userRole={demoRole}
        />
      </article>
    </div>
  );
}
