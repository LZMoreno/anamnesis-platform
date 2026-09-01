import Link from 'next/link';
import { ArrowLeft, Bookmark, Clock, MessageSquare, Share2 } from 'lucide-react';
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
  const article = {
    title: 'El peso de la palabra no dicha: Apuntes sobre la anamnesis en urgencias',
    circleSlug: params.slug,
    circleName: 'Ensayo Médico',
    author: 'Dr. Julián Sotomayor',
    authorRole: 'Médico Internista & Ensayista',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorBio: 'Especialista en medicina interna hospitalaria. Investiga las narrativas del dolor y la fenomenología del cuidado.',
    publishedDate: '1 de Septiembre, 2026',
    readingTime: '7 min de lectura',
    tags: ['Medicina Narrativa', 'Bioética', 'Guardias Clínicas', 'Humanismo'],
    paragraphs: [
      'En la guardia nocturna, el silencio de un paciente suele ser más elocuente que cualquier estudio tomográfico. La medicina moderna nos ha adiestrado para confiar ciegamente en el biomarcador y la imagen por resonancia magnética, relegando la conversación clínica a un formulario burocrático de quince minutos.',
      'Sin embargo, el término anamnesis proviene del griego ἀνάμνησις: rememoración, traer al presente lo que parecía olvidado. Cuando un enfermo cruza el umbral de urgencias con dolor torácico opresivo, su cuerpo narra una crisis biológica, pero su mirada casi siempre formula otra pregunta: ¿quién me sostendrá si esto no pasa?',
      'Recuerdo a don Mateo, un relojero de setenta y cuatro años con disnea progresiva. Sus gases arteriales eran limpios; su ecocardiograma mostraba apenas la rigidez propia de las décadas. No fue hasta que le pregunté por su taller que brotó la verdadera causa de su asfixia: hacía tres semanas había tenido que vender su última lupa de precisión para costear la pensión. El corazón humano no distingue entre la hipoxia tisular y el luto por el oficio perdido.',
      'Recuperar la escucha en el acto médico no es un capricho poético; es la forma más rigurosa de diagnóstico que conocemos.',
    ],
    comments: [
      {
        id: '1',
        author: 'Sofía Valenzuela',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        date: 'Hace 2 días',
        content: 'Este ensayo toca una fibra muy profunda. Me recordó una cita de Rita Charon sobre cómo la medicina narrativa no reemplaza la bioquímica, sino que le devuelve su propósito ontológico.',
        replies: [
          {
            id: '2',
            author: 'Dr. Julián Sotomayor',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            date: 'Hace 1 día',
            content: '¡Exactamente, Sofía! Charon dio en el clavo. Sin el relato del paciente, el diagnóstico se vuelve pura estadística desprovista de sentido existencial.',
          },
        ],
      },
    ],
  };

  return (
    <div className="pb-20">
      {/* Header Navigation */}
      <div className="border-b border-border/40 bg-muted/20 py-4">
        <div className="container mx-auto max-w-4xl px-4 flex items-center justify-between text-xs">
          <Link
            href={`/circulo/${params.slug}`}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Círculo
          </Link>
          <Badge variant="outline" className="text-xs">
            {article.circleName}
          </Badge>
        </div>
      </div>

      {/* Article Body */}
      <article className="container mx-auto max-w-3xl px-4 pt-12 space-y-8">
        <header className="space-y-6">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[11px] font-normal">
                #{tag}
              </Badge>
            ))}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.2]">
            {article.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-border/40">
            <div className="flex items-center gap-3">
              <Avatar src={article.authorAvatar} fallback="JS" className="w-11 h-11" />
              <div>
                <div className="font-medium text-sm text-foreground">{article.author}</div>
                <div className="text-xs text-muted-foreground">{article.authorRole}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.readingTime}
              </span>
              <span>•</span>
              <span>{article.publishedDate}</span>
            </div>
          </div>
        </header>

        {/* Prose Content */}
        <div className="font-serif text-lg sm:text-xl leading-relaxed text-foreground/90 space-y-6">
          {article.paragraphs.map((p, index) => (
            <p key={index} className="first-letter:text-4xl first-letter:font-bold first-letter:mr-1">
              {p}
            </p>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-8 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Bookmark className="w-3.5 h-3.5" /> Guardar en Marcadores
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <Share2 className="w-3.5 h-3.5" /> Compartir
            </Button>
          </div>
          <Link href="/agenda">
            <Button size="sm" variant="secondary" className="text-xs">
              Agendar Asesoría con el Autor
            </Button>
          </Link>
        </div>

        {/* Author Bio Box */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-6 flex items-start gap-4">
            <Avatar src={article.authorAvatar} fallback="JS" className="w-14 h-14 shrink-0" />
            <div className="space-y-1">
              <div className="font-serif font-semibold text-base">{article.author}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{article.authorBio}</p>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <section className="pt-10 space-y-6">
          <div className="flex items-center gap-2 font-serif text-2xl font-bold">
            <MessageSquare className="w-5 h-5 text-primary" />
            Comentarios & Diálogo Clínico
          </div>

          {/* Comment Input */}
          <div className="space-y-3 rounded-xl border p-4 bg-card">
            <textarea
              className="w-full bg-transparent text-sm resize-none focus:outline-none placeholder:text-muted-foreground"
              rows={3}
              placeholder="Escribe una reflexión o pregunta sobre este manuscrito..."
            />
            <div className="flex justify-end border-t border-border/40 pt-3">
              <Button size="sm" className="text-xs">
                Publicar Comentario
              </Button>
            </div>
          </div>

          {/* Threaded Comments List */}
          <div className="space-y-4">
            {article.comments.map((c) => (
              <div key={c.id} className="rounded-xl border p-4 bg-card/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar src={c.authorAvatar} fallback="SV" className="w-7 h-7" />
                    <span className="font-medium">{c.author}</span>
                  </div>
                  <span className="text-muted-foreground">{c.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed pl-9">
                  {c.content}
                </p>

                {/* Nested Replies */}
                {c.replies?.map((r) => (
                  <div key={r.id} className="ml-8 mt-3 rounded-lg border-l-2 border-primary/40 pl-4 py-2 bg-muted/20 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Avatar src={r.authorAvatar} fallback="JS" className="w-6 h-6" />
                        <span className="font-medium text-primary">{r.author} (Autor)</span>
                      </div>
                      <span className="text-muted-foreground text-[10px]">{r.date}</span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed pl-8">
                      {r.content}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
