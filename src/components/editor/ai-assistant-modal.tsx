'use client';

import * as React from 'react';
import {
  AlertCircle,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  Heading,
  Loader2,
  RefreshCw,
  Sparkles,
  Tag,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentHTML: string;
  currentTitle: string;
  circleSlug: string;
  onApplyTitle: (title: string) => void;
  onApplyExcerpt: (excerpt: string) => void;
  onApplyTags: (tags: string[]) => void;
}

export function AIAssistantModal({
  isOpen,
  onClose,
  contentHTML,
  currentTitle,
  circleSlug,
  onApplyTitle,
  onApplyExcerpt,
  onApplyTags,
}: AIAssistantModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<{
    titles: string[];
    excerpt: string;
    tags: string[];
  } | null>(null);
  const [isFallback, setIsFallback] = React.useState(false);
  const [errorBanner, setErrorBanner] = React.useState<string | null>(null);
  const [appliedItem, setAppliedItem] = React.useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setErrorBanner(null);
    setAppliedItem(null);

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: contentHTML || '<p>Manuscrito clínico</p>',
          currentTitle,
          circleSlug,
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        setSuggestions(json.data);
        setIsFallback(json.isFallback || false);
        if (json.isFallback) {
          setErrorBanner('Servicio de IA no disponible temporalmente (se han cargado sugerencias editoriales de respaldo).');
        }
      } else {
        setIsFallback(true);
        setErrorBanner(json.message || 'Servicio de IA no disponible temporalmente.');
        if (json.data) {
          setSuggestions(json.data);
        }
      }
    } catch (err: any) {
      console.warn('Error conectando con /api/ai/suggest (Graceful degradation activa):', err);
      setIsFallback(true);
      setErrorBanner('Servicio de IA no disponible temporalmente (puedes continuar redactando sin inconvenientes).');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !suggestions) {
      fetchSuggestions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyTitle = (title: string, index: number) => {
    onApplyTitle(title);
    setAppliedItem(`title-${index}`);
    setTimeout(() => setAppliedItem(null), 2000);
  };

  const handleApplyExcerpt = (excerpt: string) => {
    onApplyExcerpt(excerpt);
    setAppliedItem('excerpt');
    setTimeout(() => setAppliedItem(null), 2000);
  };

  const handleApplyTags = (tags: string[]) => {
    onApplyTags(tags);
    setAppliedItem('tags');
    setTimeout(() => setAppliedItem(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border bg-card shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg">
                  Asistente Editorial Gemini IA
                </h3>
                <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/30">
                  @google/genai
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Genera propuestas de títulos, resúmenes y etiquetas basadas en la prosa de tu manuscrito.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Graceful Degradation Banner */}
        {errorBanner && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{errorBanner}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSuggestions}
              className="min-h-[32px] text-[11px] h-7 px-2 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20"
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
              <div className="font-serif font-bold text-base">Analizando prosa del manuscrito...</div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Consultando a Google Gemini para extraer conceptos clave, tesis narrativa y sugerencias de titulación.
              </p>
            </div>
          ) : suggestions ? (
            <div className="space-y-6">
              {/* Section 1: Proposed Titles */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-serif text-sm text-foreground flex items-center gap-1.5">
                    <Heading className="w-4 h-4 text-primary" /> 3 Propuestas de Títulos Editoriales:
                  </span>
                  <span className="text-[10px] text-muted-foreground">1 clic para aplicar</span>
                </div>

                <div className="space-y-2">
                  {suggestions.titles.map((titleOption, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:border-primary/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="font-serif font-medium text-xs sm:text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary font-bold text-xs">{idx + 1}.</span>
                        <span>{titleOption}</span>
                      </div>
                      <Button
                        variant={appliedItem === `title-${idx}` ? 'secondary' : 'outline'}
                        onClick={() => handleApplyTitle(titleOption, idx)}
                        className="min-h-[44px] text-xs font-semibold shrink-0 gap-1.5 self-end sm:self-auto"
                      >
                        {appliedItem === `title-${idx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Aplicado
                          </>
                        ) : (
                          'Aplicar Título'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Proposed Excerpt */}
              <div className="space-y-2.5">
                <span className="font-bold font-serif text-sm text-foreground flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" /> Resumen / Bajada Editorial Propuesta:
                </span>

                <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3">
                  <p className="text-xs font-serif italic text-foreground/90 leading-relaxed">
                    «{suggestions.excerpt}»
                  </p>
                  <div className="flex justify-end">
                    <Button
                      variant={appliedItem === 'excerpt' ? 'secondary' : 'outline'}
                      onClick={() => handleApplyExcerpt(suggestions.excerpt)}
                      className="min-h-[44px] text-xs font-semibold gap-1.5"
                    >
                      {appliedItem === 'excerpt' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Resumen Aplicado
                        </>
                      ) : (
                        'Aplicar este Resumen'
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Section 3: Proposed Tags */}
              <div className="space-y-2.5">
                <span className="font-bold font-serif text-sm text-foreground flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-primary" /> 4 Etiquetas Temáticas Sugeridas:
                </span>

                <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant={appliedItem === 'tags' ? 'secondary' : 'outline'}
                    onClick={() => handleApplyTags(suggestions.tags)}
                    className="min-h-[44px] text-xs font-semibold gap-1.5 shrink-0"
                  >
                    {appliedItem === 'tags' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Etiquetas Agregadas
                      </>
                    ) : (
                      'Agregar Etiquetas'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border/40 bg-muted/20">
          <Button
            variant="ghost"
            onClick={fetchSuggestions}
            disabled={loading}
            className="min-h-[44px] text-xs gap-1.5 text-muted-foreground"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Regenerar Sugerencias
          </Button>

          <Button
            onClick={onClose}
            className="min-h-[44px] text-xs font-semibold px-5 bg-primary hover:bg-primary/90"
          >
            Listo / Volver a Escribir
          </Button>
        </div>
      </div>
    </div>
  );
}
