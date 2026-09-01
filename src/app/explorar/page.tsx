'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Feather,
  Layers,
  Sparkles,
} from 'lucide-react';
import { INITIAL_ARTICLES, INITIAL_CIRCLES } from '@/lib/data/mock-db';
import { ArticleSearchFilter } from '@/components/articles/article-search-filter';
import { Badge } from '@/components/ui/badge';

export default function ExplorarPage() {
  const publishedArticles = INITIAL_ARTICLES.filter((a) => a.status === 'published');

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-background pb-24">
      {/* Top Breadcrumb */}
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="container mx-auto max-w-6xl px-3 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 min-h-[44px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>

          <span className="text-xs text-muted-foreground">Catálogo General • Anamnesis</span>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-3 sm:px-6 pt-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs gap-1.5 py-1 px-3">
            <Compass className="w-3.5 h-3.5 text-primary" /> Exploración Editorial
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Biblioteca de Ensayos & Crónicas
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Busca en tiempo real entre los manuscritos publicados, filtra por temática, autor o círculo editorial, y gestiona tus lecturas guardadas.
          </p>
        </div>

        {/* Search and Multi-Faceted Filters Component (300ms Debounce) */}
        <ArticleSearchFilter articles={publishedArticles} />
      </div>
    </div>
  );
}
