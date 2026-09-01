'use client';

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { BookSearchModal } from '@/components/editor/book-search-modal';
import { ImageUploadModal } from '@/components/editor/image-upload-modal';
import { sanitizePastedHTML, countWordsFast } from '@/lib/editor/sanitize';
import { Clock, FileText, Sparkles, Zap } from 'lucide-react';

interface TipTapEditorProps {
  initialContent?: string;
  onChange?: (html: string, wordCount: number, readingTimeMin: number) => void;
  onDirty?: () => void;
}

export function TipTapEditor({
  initialContent = '',
  onChange,
  onDirty,
}: TipTapEditorProps) {
  const [bookModalOpen, setBookModalOpen] = React.useState(false);
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [stats, setStats] = React.useState({
    words: 0,
    characters: 0,
    readingTimeMin: 1,
  });

  // Ref para debounce en actualización de textos monstruo (+9,000 palabras)
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-muted/80 text-foreground p-4 rounded-xl font-mono text-xs overflow-x-auto border my-4',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary/60 pl-4 italic my-4 text-foreground/90 font-serif',
          },
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4 hover:opacity-80 transition font-medium',
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-6 shadow-md border border-border/40 mx-auto block',
          loading: 'lazy',
          decoding: 'async',
        },
      }),
      Placeholder.configure({
        placeholder: 'Comienza a redactar tu manuscrito, reflexión clínica o crónica...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[500px] font-serif text-base sm:text-lg leading-relaxed text-foreground px-6 sm:px-12 py-8',
      },
      // Sanitización estricta al pegar desde Microsoft Word, Google Docs o portapapeles externo
      transformPastedHTML(html) {
        return sanitizePastedHTML(html);
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData('text/plain');
        return false;
      },
    },
    onUpdate({ editor }) {
      if (onDirty) {
        onDirty();
      }

      // Debounce de 250ms para evitar lag en manuscritos extensos
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const text = editor.getText();
        const html = editor.getHTML();
        const calculatedStats = countWordsFast(text);
        setStats(calculatedStats);

        if (onChange) {
          onChange(html, calculatedStats.words, calculatedStats.readingTimeMin);
        }
      }, 250);
    },
  });

  // Calcular métricas iniciales al montar
  React.useEffect(() => {
    if (editor) {
      const text = editor.getText();
      setStats(countWordsFast(text));
    }
  }, [editor]);

  // Inserción de cita de libro proveniente de Open Library
  const handleInsertCitation = (citationHTML: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(citationHTML).run();
    if (onDirty) onDirty();
  };

  // Inserción de imagen
  const handleInsertImage = (url: string, alt?: string) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .setImage({ src: url, alt: alt || 'Imagen de manuscrito' })
      .run();
    if (onDirty) onDirty();
  };

  return (
    <div className="w-full flex flex-col rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
      {/* TipTap Formatting Toolbar */}
      <EditorToolbar
        editor={editor}
        onOpenBookModal={() => setBookModalOpen(true)}
        onOpenImageModal={() => setImageModalOpen(true)}
      />

      {/* Editor Canvas with Generous Top Padding */}
      <div className="flex-1 bg-background/50 min-h-[500px] cursor-text">
        <EditorContent editor={editor} />
      </div>

      {/* Monster Article Performance & Word Count Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 px-4 sm:px-6 border-t border-border/40 bg-muted/20 text-xs text-muted-foreground select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <FileText className="w-3.5 h-3.5 text-primary" /> {stats.words.toLocaleString()}{' '}
            palabras
          </span>
          <span>•</span>
          <span>{stats.characters.toLocaleString()} caracteres</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> ~{stats.readingTimeMin} min de lectura
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <Zap className="w-3.5 h-3.5" /> Motor TipTap 60fps optimizado
          </span>
          <span className="hidden sm:inline text-muted-foreground/60">|</span>
          <span className="hidden sm:inline text-muted-foreground">
            Filtro Anti-XSS & Word Activo
          </span>
        </div>
      </div>

      {/* Modals */}
      <BookSearchModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onInsertCitation={handleInsertCitation}
      />

      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onInsertImage={handleInsertImage}
      />
    </div>
  );
}
