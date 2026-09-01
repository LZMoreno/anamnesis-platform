export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  cover_url?: string;
  publisher?: string[];
  isbn?: string[];
}

const FALLBACK_BOOKS: OpenLibraryBook[] = [
  {
    key: '/works/OL102749W',
    title: 'La muerte de Iván Ilich',
    author_name: ['Lev Tolstói'],
    first_publish_year: 1886,
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    publisher: ['Alianza Editorial'],
  },
  {
    key: '/works/OL102750W',
    title: 'El emperador de todos los males: Una biografía del cáncer',
    author_name: ['Siddhartha Mukherjee'],
    first_publish_year: 2010,
    cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=300&auto=format&fit=crop&q=80',
    publisher: ['Debate'],
  },
  {
    key: '/works/OL102751W',
    title: 'La amortajada',
    author_name: ['María Luisa Bombal'],
    first_publish_year: 1938,
    cover_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&auto=format&fit=crop&q=80',
    publisher: ['Editorial Nascimento'],
  },
  {
    key: '/works/OL102752W',
    title: 'Cien años de soledad',
    author_name: ['Gabriel García Márquez'],
    first_publish_year: 1967,
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&auto=format&fit=crop&q=80',
    publisher: ['Editorial Sudamericana'],
  },
];

/**
 * Busca libros en la API pública de Open Library con fallback automático si hay problemas de red
 */
export async function searchOpenLibraryBooks(query: string): Promise<OpenLibraryBook[]> {
  if (!query || query.trim().length < 2) {
    return FALLBACK_BOOKS;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      query.trim()
    )}&limit=8&fields=key,title,author_name,first_publish_year,cover_i,publisher,isbn`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open Library API responded with status ${res.status}`);
    }

    const data = await res.json();
    if (!data.docs || data.docs.length === 0) {
      return FALLBACK_BOOKS.filter((b) =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author_name?.some((a) => a.toLowerCase().includes(query.toLowerCase()))
      );
    }

    return data.docs.map((doc: any) => ({
      key: doc.key,
      title: doc.title,
      author_name: doc.author_name || ['Autor Desconocido'],
      first_publish_year: doc.first_publish_year || 0,
      cover_i: doc.cover_i,
      cover_url: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
      publisher: doc.publisher || [],
      isbn: doc.isbn || [],
    }));
  } catch (error) {
    console.warn('Open Library API offline or timed out, using fallback results', error);
    return FALLBACK_BOOKS.filter((b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author_name?.some((a) => a.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

/**
 * Genera el snippet HTML de una Ficha Bibliográfica / Cita de Libro para insertar en TipTap
 */
export function generateBookCitationHTML(
  book: OpenLibraryBook,
  quoteText?: string
): string {
  const author = book.author_name?.join(', ') || 'Autor Desconocido';
  const year = book.first_publish_year ? `(${book.first_publish_year})` : '';
  const coverUrl =
    book.cover_url ||
    (book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80');

  const quoteHTML = quoteText
    ? `<p class="italic text-foreground/90 font-serif my-1 border-l-2 border-primary/40 pl-3">«${quoteText}»</p>`
    : '';

  return `
<div class="book-citation-card my-6 p-4 rounded-xl border border-primary/20 bg-muted/30 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 not-prose" data-book-title="${book.title}" data-book-author="${author}" data-book-year="${book.first_publish_year || ''}" data-book-cover="${coverUrl}">
  <img src="${coverUrl}" alt="${book.title}" class="w-20 h-28 object-cover rounded-md shadow-md shrink-0 border" loading="lazy" />
  <div class="flex-1 text-center sm:text-left space-y-1">
    <div class="text-[10px] uppercase tracking-wider font-semibold text-primary">Cita Bibliográfica • Open Library</div>
    <h4 class="font-serif font-bold text-base text-foreground leading-snug">${book.title}</h4>
    <div class="text-xs text-muted-foreground font-medium">${author} ${year}</div>
    ${quoteHTML}
  </div>
</div>
<p></p>
`.trim();
}
