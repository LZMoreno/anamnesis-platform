'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  FileCheck,
  Globe,
  Image as ImageIcon,
  Layers,
  Loader2,
  Lock,
  Save,
  Send,
  Settings2,
  Shield,
  Sparkles,
  Tag,
  XCircle,
} from 'lucide-react';
import { TipTapEditor } from '@/components/editor/tiptap-editor';
import { EditorPreview } from '@/components/editor/editor-preview';
import { AIAssistantModal } from '@/components/editor/ai-assistant-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { INITIAL_CIRCLES, INITIAL_ARTICLES, INITIAL_AUTHORS } from '@/lib/data/mock-db';

type SaveState = 'saved' | 'saving' | 'dirty' | 'error';
type ArticleStatus = 'draft' | 'published' | 'archived';

export default function ArticleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = (params.id as string) || 'nuevo';

  // Buscar si existe artículo inicial o crear nuevo
  const existingArticle = INITIAL_ARTICLES.find(
    (a) => a.id === articleId || a.slug === articleId
  );

  const [title, setTitle] = React.useState(
    existingArticle?.title || 'Nuevo Ensayo Clínico sobre la Memoria Hospitalaria'
  );
  const [excerpt, setExcerpt] = React.useState(
    existingArticle?.excerpt ||
      'Una investigación sobre el impacto del relato subjetivo del paciente en el diagnóstico diferencial...'
  );
  const [contentHTML, setContentHTML] = React.useState(
    existingArticle?.slug === 'el-peso-de-la-palabra-no-dicha'
      ? `<p>En la guardia nocturna, el silencio de un paciente suele ser más elocuente que cualquier estudio tomográfico. La medicina moderna nos ha adiestrado para confiar ciegamente en el biomarcador y la imagen por resonancia magnética, relegando la conversación clínica a un formulario burocrático de quince minutos.</p>
<p>Sin embargo, el término anamnesis proviene del griego ἀνάμνησις: rememoración, traer al presente lo que parecía olvidado. Cuando un enfermo cruza el umbral de urgencias con dolor torácico opresivo, su cuerpo narra una crisis biológica, pero su mirada casi siempre formula otra pregunta: ¿quién me sostendrá si esto no pasa?</p>
<div class="book-citation-card my-6 p-4 rounded-xl border border-primary/20 bg-muted/30 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 not-prose" data-book-title="La muerte de Iván Ilich" data-book-author="Lev Tolstói" data-book-year="1886" data-book-cover="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80">
  <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80" alt="La muerte de Iván Ilich" class="w-20 h-28 object-cover rounded-md shadow-md shrink-0 border" loading="lazy" />
  <div class="flex-1 text-center sm:text-left space-y-1">
    <div class="text-[10px] uppercase tracking-wider font-semibold text-primary">Cita Bibliográfica • Open Library</div>
    <h4 class="font-serif font-bold text-base text-foreground leading-snug">La muerte de Iván Ilich</h4>
    <div class="text-xs text-muted-foreground font-medium">Lev Tolstói (1886)</div>
    <p class="italic text-foreground/90 font-serif my-1 border-l-2 border-primary/40 pl-3">«La historia de la vida de Iván Ilich era la más sencilla, la más corriente y la más terrible.»</p>
  </div>
</div>
<p>Recuperar la escucha en el acto médico no es un capricho poético; es la forma más rigurosa de diagnóstico que conocemos.</p>`
      : '<p>Comienza a redactar tu texto aquí...</p>'
  );
  const [circleSlug, setCircleSlug] = React.useState(
    existingArticle?.circleSlug || 'ensayo-medico'
  );
  const [status, setStatus] = React.useState<ArticleStatus>(
    existingArticle?.status || 'draft'
  );
  const [tags, setTags] = React.useState<string[]>(
    existingArticle?.tags || ['Medicina Narrativa', 'Bioética', 'Guardias']
  );
  const [coverUrl, setCoverUrl] = React.useState(
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80'
  );
  const [tagInput, setTagInput] = React.useState('');

  // Estados de interfaz y guardado
  const [viewMode, setViewMode] = React.useState<'edit' | 'preview'>('edit');
  const [saveState, setSaveState] = React.useState<SaveState>('saved');
  const [lastSavedTime, setLastSavedTime] = React.useState<string>('Recién cargado');
  const [isDirty, setIsDirty] = React.useState(false);
  const [stats, setStats] = React.useState({
    words: 420,
    readingTimeMin: 3,
  });
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [aiModalOpen, setAiModalOpen] = React.useState(false);

  // Autor por defecto (Dr. Julián Sotomayor)
  const author = INITIAL_AUTHORS['bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb'];
  const currentCircle = INITIAL_CIRCLES[circleSlug] || INITIAL_CIRCLES['ensayo-medico'];

  // 1. AUTOGUARDADO CADA 5 SEGUNDOS
  React.useEffect(() => {
    if (!isDirty) return;

    setSaveState('dirty');

    const autosaveTimer = setTimeout(() => {
      handlePerformSave(false);
    }, 5000); // 5 segundos

    return () => clearTimeout(autosaveTimer);
  }, [isDirty, title, excerpt, contentHTML, circleSlug, status, tags, coverUrl]);

  const handlePerformSave = (showNotification = true) => {
    setSaveState('saving');

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSavedTime(timeStr);
      setSaveState('saved');
      setIsDirty(false);

      if (showNotification && status === 'published') {
        alert('¡Manuscrito guardado y publicado en el círculo correspondiente!');
      }
    }, 700);
  };

  const handleContentChange = (
    html: string,
    words: number,
    readingTimeMin: number
  ) => {
    setContentHTML(html);
    setStats({ words, readingTimeMin });
    setIsDirty(true);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
        setIsDirty(true);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setIsDirty(true);
  };

  // Asistente IA Handlers
  const handleApplyAITitle = (newTitle: string) => {
    setTitle(newTitle);
    setIsDirty(true);
  };

  const handleApplyAIExcerpt = (newExcerpt: string) => {
    setExcerpt(newExcerpt);
    setIsDirty(true);
  };

  const handleApplyAITags = (newTags: string[]) => {
    const merged = Array.from(new Set([...tags, ...newTags]));
    setTags(merged);
    setIsDirty(true);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-background pb-24">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-colors">
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={`/circulo/${circleSlug}`}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              title="Volver al círculo"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Redacción</span>
                <span>/</span>
                <span className="font-medium text-foreground">{currentCircle.name}</span>
              </div>
            </div>
          </div>

          {/* Center: Autosave Status Indicator */}
          <div className="flex items-center gap-2 text-xs">
            {saveState === 'saving' && (
              <div className="flex items-center gap-1.5 text-primary font-medium px-2.5 py-1 rounded-full bg-primary/10 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Guardando...</span>
              </div>
            )}
            {saveState === 'saved' && (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Guardado a las {lastSavedTime}</span>
                <span className="sm:hidden">Guardado</span>
              </div>
            )}
            {saveState === 'dirty' && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium px-2.5 py-1 rounded-full bg-amber-500/10">
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cambios pendientes (autoguarda en 5s)...</span>
                <span className="sm:hidden">Sin guardar</span>
              </div>
            )}
            {saveState === 'error' && (
              <div className="flex items-center gap-1.5 text-destructive font-medium px-2.5 py-1 rounded-full bg-destructive/10">
                <XCircle className="w-3.5 h-3.5" />
                <span>Error al guardar</span>
              </div>
            )}
          </div>

          {/* Right Actions: AI Assistant, Status Selector, Preview Toggle, Settings, Save */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* AI Assistant Button */}
            <Button
              variant="outline"
              onClick={() => setAiModalOpen(true)}
              className="min-h-[44px] text-xs font-semibold gap-1.5 px-3 border-primary/40 bg-primary/5 hover:bg-primary/15 text-primary transition"
              title="Asistente Editorial IA (Google Gemini)"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="hidden sm:inline">Asistente IA</span>
            </Button>

            {/* Status Selector */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as ArticleStatus);
                setIsDirty(true);
              }}
              className="min-h-[44px] rounded-lg border border-input bg-background px-2.5 sm:px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>

            {/* Toggle Preview Mode */}
            <Button
              variant={viewMode === 'preview' ? 'secondary' : 'outline'}
              onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
              className="min-h-[44px] text-xs font-medium gap-1.5 px-3"
            >
              {viewMode === 'edit' ? (
                <>
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="hidden md:inline">Vista Previa</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 text-primary" />
                  <span className="hidden md:inline">Editar</span>
                </>
              )}
            </Button>

            {/* Metadata Settings Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`min-h-[44px] min-w-[44px] ${settingsOpen ? 'bg-accent' : ''}`}
              title="Ajustes de metadata del artículo"
            >
              <Settings2 className="w-4 h-4" />
            </Button>

            {/* Manual Save / Publish Button */}
            <Button
              onClick={() => handlePerformSave(true)}
              className="min-h-[44px] text-xs font-medium gap-1.5 bg-primary hover:bg-primary/90 px-3.5 sm:px-4"
            >
              {status === 'published' ? (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Publicar</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Guardar</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container mx-auto max-w-6xl px-3 sm:px-6 pt-6 space-y-6">
        {/* Collapsible Metadata Settings Drawer */}
        {settingsOpen && (
          <div className="p-5 rounded-2xl border border-primary/30 bg-card shadow-md space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h3 className="font-serif font-bold text-sm flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" /> Metadatos y Configuración del Artículo
              </h3>
              <span className="text-[11px] text-muted-foreground">Autoguardado activado</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Circle Assignment */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Círculo Editorial de Publicación</label>
                <select
                  value={circleSlug}
                  onChange={(e) => {
                    setCircleSlug(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3 text-xs"
                >
                  <option value="ensayo-medico">Ensayo Médico</option>
                  <option value="cronica">Crónica</option>
                  <option value="resena-literaria">Reseña Literaria</option>
                </select>
              </div>

              {/* Cover URL */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium">URL de Imagen de Portada</label>
                <Input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => {
                    setCoverUrl(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="min-h-[44px] text-xs"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Extracto / Bajada Editorial</label>
              <textarea
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setIsDirty(true);
                }}
                rows={2}
                placeholder="Breve síntesis o tesis del manuscrito..."
                className="w-full text-xs font-serif p-2.5 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Etiquetas Temáticas (Presiona Enter para agregar)</label>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 text-[11px] cursor-pointer hover:bg-destructive/20 transition"
                    onClick={() => handleRemoveTag(tag)}
                    title="Clic para eliminar etiqueta"
                  >
                    #{tag} ✕
                  </Badge>
                ))}
              </div>
              <Input
                type="text"
                placeholder="Escribe una etiqueta y presiona Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="min-h-[44px] text-xs"
              />
            </div>
          </div>
        )}

        {/* View Mode: Edit vs Preview */}
        {viewMode === 'edit' ? (
          <div className="space-y-6">
            {/* Document Header Fields */}
            <div className="space-y-3 bg-card p-5 sm:p-8 rounded-2xl border border-border/80 shadow-sm">
              <Input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Título del Manuscrito o Ensayo..."
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/60 min-h-[50px]"
              />

              <Input
                type="text"
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Escribe un extracto o reflexión inicial..."
                className="font-serif text-sm sm:text-base text-muted-foreground border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50 min-h-[40px]"
              />
            </div>

            {/* TipTap Rich Text Canvas */}
            <TipTapEditor
              initialContent={contentHTML}
              onChange={handleContentChange}
              onDirty={() => setIsDirty(true)}
            />
          </div>
        ) : (
          /* Live Publication Preview */
          <EditorPreview
            title={title}
            excerpt={excerpt}
            coverUrl={coverUrl}
            contentHTML={contentHTML}
            circleName={currentCircle.name}
            authorName={author.fullName}
            authorAvatar={author.avatarUrl}
            authorBio={author.bio}
            readingTimeMin={stats.readingTimeMin}
            tags={tags}
          />
        )}
      </div>

      {/* AI Assistant Modal (Google Gemini) */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        contentHTML={contentHTML}
        currentTitle={title}
        circleSlug={circleSlug}
        onApplyTitle={handleApplyAITitle}
        onApplyExcerpt={handleApplyAIExcerpt}
        onApplyTags={handleApplyAITags}
      />
    </div>
  );
}
