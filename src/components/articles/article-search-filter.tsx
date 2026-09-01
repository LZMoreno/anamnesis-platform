'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Bookmark,
  BookOpen,
  Calendar,
  Clock,
  Filter,
  Layers,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  User,
  X,
} from 'lucide-react';
import {
  CircleArticleItem,
  INITIAL_AUTHORS,
  INITIAL_CIRCLES,
  isArticleBookmarked,
  toggleBookmarkMock,
} from '@/lib/data/mock-db';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface ArticleSearchFilterProps {
  articles: CircleArticleItem[];
  initialCircleSlug?: string;
  initialTag?: string;
  showOnlySavedInitial?: boolean;
}

export function ArticleSearchFilter({
  articles,
  initialCircleSlug = 'all',
  initialTag = 'all',
  showOnlySavedInitial = false,
}: ArticleSearchFilterProps) {
  // Input raw para respuesta instantánea en el input
  const [searchInput, setSearchInput] = React.useState('');
  // Query con debounce de 300ms
  const [debouncedQuery, setDebouncedQuery] = React.useState('');

  // Filtros seleccionados
  const [selectedCircle, setSelectedCircle] = React.useState(initialCircleSlug);
  const [selectedAuthor, setSelectedAuthor] = React.useState('all');
  const [selectedTag, setSelectedTag] = React.useState(initialTag);
  const [selectedReadingTime, setSelectedReadingTime] = React.useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [onlySaved, setOnlySaved] = React.useState(showOnlySavedInitial);

  // Estado local de bookmarks para actualización instantánea
  const [savedIds, setSavedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setSavedIds(articles.filter((a) => isArticleBookmarked(a.id)).map((a) => a.id));
  }, [articles]);

  // 1. DEBOUNCE DE 300ms PARA BÚSQUEDA EN TIEMPO REAL
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchInput.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Extraer todos los tags únicos disponibles
  const availableTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((art) => art.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [articles]);

  // Filtrado reactivo de manuscritos
  const filteredArticles = React.useMemo(() => {
    return articles.filter((art) => {
      // 1. Filtro de búsqueda por texto (título, extracto, autor, círculo, tags)
      if (debouncedQuery) {
        const matchTitle = art.title.toLowerCase().includes(debouncedQuery);
        const matchExcerpt = art.excerpt.toLowerCase().includes(debouncedQuery);
        const matchAuthor = art.authorName.toLowerCase().includes(debouncedQuery);
        const matchCircle = art.circleName.toLowerCase().includes(debouncedQuery);
        const matchTags = art.tags.some((t) => t.toLowerCase().includes(debouncedQuery));

        if (!matchTitle && !matchExcerpt && !matchAuthor && !matchCircle && !matchTags) {
          return false;
        }
      }

      // 2. Filtro por Círculo
      if (selectedCircle !== 'all' && art.circleSlug !== selectedCircle) {
        return false;
      }

      // 3. Filtro por Autor
      if (selectedAuthor !== 'all' && art.authorId !== selectedAuthor) {
        return false;
      }

      // 4. Filtro por Tag / Tema
      if (selectedTag !== 'all' && !art.tags.includes(selectedTag)) {
        return false;
      }

      // 5. Filtro por Tiempo de lectura
      if (selectedReadingTime === 'short' && art.readingTimeMin > 5) return false;
      if (selectedReadingTime === 'medium' && (art.readingTimeMin <= 5 || art.readingTimeMin > 8)) return false;
      if (selectedReadingTime === 'long' && art.readingTimeMin <= 8) return false;

      // 6. Filtro solo guardados / marcadores
      if (onlySaved && !savedIds.includes(art.id)) {
        return false;
      }

      return true;
    });
  }, [
    articles,
    debouncedQuery,
    selectedCircle,
    selectedAuthor,
    selectedTag,
    selectedReadingTime,
    onlySaved,
    savedIds,
  ]);

  const handleToggleBookmark = async (articleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const res = await toggleBookmarkMock(articleId);
    if (res.isBookmarked !== undefined || res) {
      if (savedIds.includes(articleId)) {
        setSavedIds(savedIds.filter((id) => id !== articleId));
      } else {
        setSavedIds([...savedIds, articleId]);
      }
    }
  };

  const hasActiveFilters =
    debouncedQuery !== '' ||
    selectedCircle !== 'all' ||
    selectedAuthor !== 'all' ||
    selectedTag !== 'all' ||
    selectedReadingTime !== 'all' ||
    onlySaved;

  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedQuery('');
    setSelectedCircle('all');
    setSelectedAuthor('all');
    setSelectedTag('all');
    setSelectedReadingTime('all');
    setOnlySaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Input & Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border bg-card shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box with 300ms debounce */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por tesis, autor, fragmento de prosa o tema (ej. 'bioética', 'urgencias')..."
              className="pl-10 pr-9 min-h-[44px] text-xs sm:text-sm bg-background"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bookmarking Toggle Button */}
          <Button
            variant={onlySaved ? 'secondary' : 'outline'}
            onClick={() => setOnlySaved(!onlySaved)}
            className={`min-h-[44px] text-xs font-semibold gap-1.5 px-4 shrink-0 transition ${
              onlySaved ? 'bg-primary/15 border-primary/40 text-primary' : ''
            }`}
          >
            <Bookmark className={`w-4 h-4 ${onlySaved ? 'fill-primary text-primary' : ''}`} />
            <span>Mis Marcadores ({savedIds.length})</span>
          </Button>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 border-t border-border/40 text-xs">
          {/* Filter 1: Círculo */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">Círculo Editorial:</label>
            <select
              value={selectedCircle}
              onChange={(e) => setSelectedCircle(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3 text-xs font-medium focus:outline-none"
            >
              <option value="all">Todos los Círculos</option>
              <option value="ensayo-medico">Ensayo Médico</option>
              <option value="cronica">Crónica</option>
              <option value="resena-literaria">Reseña Literaria</option>
            </select>
          </div>

          {/* Filter 2: Autor */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">Autor / Ensayista:</label>
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3 text-xs font-medium focus:outline-none"
            >
              <option value="all">Todos los Autores</option>
              <option value="bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb">Dr. Julián Sotomayor</option>
              <option value="cccccccc-3333-4333-c333-cccccccccccc">Elena Rocafuerte</option>
            </select>
          </div>

          {/* Filter 3: Tema / Tag */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">Tema / Etiqueta:</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3 text-xs font-medium focus:outline-none"
            >
              <option value="all">Todos los Temas</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 4: Tiempo de Lectura */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">Tiempo de Lectura:</label>
            <select
              value={selectedReadingTime}
              onChange={(e) => setSelectedReadingTime(e.target.value as any)}
              className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3 text-xs font-medium focus:outline-none"
            >
              <option value="all">Cualquier duración</option>
              <option value="short">Corta (&le; 5 min)</option>
              <option value="medium">Media (6 - 8 min)</option>
              <option value="long">Profunda (&gt; 8 min)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-muted-foreground">
              Mostrando <strong className="text-foreground">{filteredArticles.length}</strong> de {articles.length} manuscritos:
            </span>

            {debouncedQuery && (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                Texto: &quot;{debouncedQuery}&quot;
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchInput('')} />
              </Badge>
            )}
            {selectedCircle !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                Círculo: {selectedCircle}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCircle('all')} />
              </Badge>
            )}
            {selectedAuthor !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                Autor: {INITIAL_AUTHORS[selectedAuthor]?.fullName || selectedAuthor}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAuthor('all')} />
              </Badge>
            )}
            {selectedTag !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                #{selectedTag}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedTag('all')} />
              </Badge>
            )}
            {onlySaved && (
              <Badge variant="secondary" className="gap-1 text-[10px] bg-primary/20 text-primary">
                Solo Guardados
                <X className="w-3 h-3 cursor-pointer" onClick={() => setOnlySaved(false)} />
              </Badge>
            )}
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="min-h-[32px] text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3 h-3" /> Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <Card className="p-10 text-center space-y-3">
          <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/60" />
          <div className="font-serif font-bold text-lg">No se encontraron manuscritos</div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Ningún ensayo coincide con tus filtros de búsqueda. Prueba ajustando los términos o restableciendo los filtros.
          </p>
          <Button onClick={handleResetFilters} variant="outline" className="min-h-[44px] text-xs mt-2">
            Restablecer todos los filtros
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((art) => {
            const isSaved = savedIds.includes(art.id);

            return (
              <Card
                key={art.id}
                className="group flex flex-col justify-between hover:border-primary/50 transition-all duration-200 overflow-hidden shadow-sm"
              >
                <CardHeader className="p-5 pb-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/circulo/${art.circleSlug}`}
                      className="text-[11px] font-semibold text-primary uppercase tracking-wider hover:underline"
                    >
                      {art.circleName}
                    </Link>

                    {/* Bookmark Toggle Button */}
                    <button
                      onClick={(e) => handleToggleBookmark(art.id, e)}
                      className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full transition ${
                        isSaved
                          ? 'text-primary bg-primary/10 hover:bg-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      title={isSaved ? 'Quitar de guardados' : 'Guardar para después'}
                      aria-label="Guardar para después"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary' : ''}`} />
                    </button>
                  </div>

                  <Link href={`/circulo/${art.circleSlug}/articulos/${art.slug}`}>
                    <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                  </Link>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  <p className="text-xs font-serif text-muted-foreground line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {art.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] cursor-pointer hover:bg-primary/10"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedTag(tag);
                        }}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Author & Reading Time Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground">
                    <Link
                      href={`/autor/${art.authorId}`}
                      className="flex items-center gap-2 group/author min-h-[36px]"
                    >
                      <Avatar src={art.authorAvatar} fallback="AU" className="w-6 h-6 border" />
                      <span className="font-serif font-medium text-foreground group-hover/author:text-primary transition truncate max-w-[130px]">
                        {art.authorName}
                      </span>
                    </Link>

                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3" /> {art.readingTimeMin} min
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
