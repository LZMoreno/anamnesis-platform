'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Clock,
  Eye,
  MessageSquare,
  Share2,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EditorPreviewProps {
  title: string;
  excerpt: string;
  coverUrl: string;
  contentHTML: string;
  circleName: string;
  authorName: string;
  authorAvatar: string;
  authorBio: string;
  readingTimeMin: number;
  tags: string[];
}

export function EditorPreview({
  title,
  excerpt,
  coverUrl,
  contentHTML,
  circleName,
  authorName,
  authorAvatar,
  authorBio,
  readingTimeMin,
  tags,
}: EditorPreviewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 bg-card rounded-2xl border border-border/80 p-5 sm:p-10 shadow-sm animate-in fade-in duration-200">
      {/* Preview Watermark Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40 text-xs">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <Eye className="w-4 h-4" />
          <span>Vista Previa de Publicación Editorial</span>
        </div>
        <Badge variant="outline" className="text-[11px] bg-primary/5 text-primary border-primary/30">
          {circleName}
        </Badge>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        {/* Cover Image */}
        {coverUrl && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted border border-border/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={title || 'Portada'}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 pt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[11px] font-normal">
              #{tag}
            </Badge>
          ))}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.2]">
          {title || 'Título del Manuscrito'}
        </h1>

        {excerpt && (
          <p className="text-base sm:text-lg text-muted-foreground font-serif italic leading-relaxed">
            {excerpt}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-border/40 text-xs">
          <div className="flex items-center gap-3">
            <Avatar src={authorAvatar} fallback="AU" className="w-11 h-11 border border-border/60" />
            <div>
              <div className="font-serif font-bold text-sm text-foreground">{authorName}</div>
              <div className="text-muted-foreground">Autor Colaborador en Anamnesis</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" /> {readingTimeMin} min de lectura
            </span>
            <span>•</span>
            <span>Fecha de hoy</span>
          </div>
        </div>
      </header>

      {/* Prose Rendered Body */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none font-serif text-base sm:text-lg leading-relaxed text-foreground/90 space-y-4"
        dangerouslySetInnerHTML={{
          __html:
            contentHTML ||
            '<p class="text-muted-foreground italic">El cuerpo del artículo se encuentra vacío. Escribe algo en el editor para visualizarlo.</p>',
        }}
      />

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border/40 text-xs">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="min-h-[44px] gap-2 text-xs font-medium">
            <Bookmark className="w-4 h-4" /> Guardar Marcador
          </Button>
          <Button variant="ghost" className="min-h-[44px] gap-2 text-xs font-medium">
            <Share2 className="w-4 h-4" /> Compartir
          </Button>
        </div>
        <Button variant="secondary" className="min-h-[44px] text-xs font-medium">
          Agendar Mentoría con el Autor
        </Button>
      </div>

      {/* Author Card Box */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <Avatar src={authorAvatar} fallback="AU" className="w-14 h-14 shrink-0" />
          <div className="space-y-1">
            <div className="font-serif font-bold text-base">{authorName}</div>
            <p className="text-xs text-muted-foreground leading-relaxed font-serif">
              {authorBio || 'Ensayista y colaborador en la plataforma Anamnesis.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
