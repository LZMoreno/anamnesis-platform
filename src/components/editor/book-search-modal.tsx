'use client';

import * as React from 'react';
import {
  BookOpen,
  Check,
  Globe,
  Loader2,
  Plus,
  Quote,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import {
  searchOpenLibraryBooks,
  generateBookCitationHTML,
  OpenLibraryBook,
} from '@/lib/editor/open-library';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertCitation: (htmlContent: string) => void;
}

export function BookSearchModal({
  isOpen,
  onClose,
  onInsertCitation,
}: BookSearchModalProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<OpenLibraryBook[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState<OpenLibraryBook | null>(null);
  const [quoteText, setQuoteText] = React.useState('');

  // Cargar libros iniciales
  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      searchOpenLibraryBooks('').then((books) => {
        setResults(books);
        if (books.length > 0 && !selectedBook) {
          setSelectedBook(books[0]);
        }
        setLoading(false);
      });
    }
  }, [isOpen]);

  // Debounce en búsqueda
  React.useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => {
      setLoading(true);
      searchOpenLibraryBooks(query).then((books) => {
        setResults(books);
        if (books.length > 0) {
          setSelectedBook(books[0]);
        }
        setLoading(false);
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, isOpen]);

  if (!isOpen) return null;

  const handleInsert = () => {
    if (!selectedBook) return;
    const citationHTML = generateBookCitationHTML(selectedBook, quoteText);
    onInsertCitation(citationHTML);
    onClose();
    setQuoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border bg-card shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg">
                Insertar Cita de Libro • Open Library
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Busca en el catálogo público global de Open Library e inserta una ficha estructurada.
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por título, autor o ISBN (ej. Tolstói, Cien años de soledad)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 min-h-[44px] text-xs sm:text-sm"
              autoFocus
            />
          </div>

          {/* Results List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
              <span>Resultados ({results.length}):</span>
              {loading && (
                <span className="flex items-center gap-1 text-primary text-[11px]">
                  <Loader2 className="w-3 h-3 animate-spin" /> Buscando en Open Library...
                </span>
              )}
            </div>

            <div className="grid gap-2 sm:grid-cols-2 max-h-56 overflow-y-auto pr-1">
              {results.map((book) => {
                const isSelected = selectedBook?.key === book.key;
                const coverUrl =
                  book.cover_url ||
                  (book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150');

                return (
                  <div
                    key={book.key}
                    onClick={() => setSelectedBook(book)}
                    className={`p-2.5 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                        : 'border-border/60 hover:bg-muted/40'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded shadow-sm shrink-0 border"
                      loading="lazy"
                    />
                    <div className="space-y-0.5 overflow-hidden flex-1">
                      <div className="font-serif font-bold text-xs text-foreground truncate">
                        {book.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {book.author_name?.join(', ')}
                      </div>
                      {book.first_publish_year ? (
                        <div className="text-[10px] text-primary font-medium">
                          {book.first_publish_year}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {results.length === 0 && !loading && (
                <div className="col-span-2 py-8 text-center text-xs text-muted-foreground">
                  No se encontraron libros con ese término de búsqueda.
                </div>
              )}
            </div>
          </div>

          {/* Selected Book Preview & Optional Quote Input */}
          {selectedBook && (
            <div className="rounded-xl border border-primary/30 bg-muted/20 p-3.5 space-y-2.5">
              <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-primary" /> Cita o fragmento textual (Opcional):
              </div>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="«El dolor no es una cifra en la escala del uno al diez; es una pregunta que no halla respuesta...»"
                rows={2}
                className="w-full text-xs font-serif p-2.5 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border/40 bg-muted/20">
          <div className="text-[11px] text-muted-foreground hidden sm:block">
            {selectedBook ? `Seleccionado: ${selectedBook.title}` : 'Selecciona un libro'}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="min-h-[44px] text-xs font-medium px-4"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleInsert}
              disabled={!selectedBook}
              className="min-h-[44px] text-xs font-medium bg-primary hover:bg-primary/90 px-5 gap-1.5"
            >
              <Plus className="w-4 h-4" /> Insertar Cita en Artículo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
