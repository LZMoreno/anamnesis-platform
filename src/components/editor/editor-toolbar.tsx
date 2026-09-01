'use client';

import * as React from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  CodeSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  BookOpen,
  Minus,
  Undo2,
  Redo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  editor: Editor | null;
  onOpenBookModal: () => void;
  onOpenImageModal: () => void;
}

export function EditorToolbar({
  editor,
  onOpenBookModal,
  onOpenImageModal,
}: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Ingresa la URL del enlace:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="sticky top-16 z-30 w-full border-b border-border/80 bg-card shadow-sm py-2 px-2 sm:px-4 transition-colors">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {/* Headings */}
        <div className="flex items-center border-r border-border/60 pr-1.5 mr-1 gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center text-xs font-bold transition ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Encabezado Principal (H1)"
          >
            <Heading1 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center text-xs font-bold transition ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Subencabezado (H2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center text-xs font-bold transition ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Sección Menor (H3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Text Formats */}
        <div className="flex items-center border-r border-border/60 pr-1.5 mr-1 gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center transition ${
              editor.isActive('bold')
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Negrita (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center transition ${
              editor.isActive('italic')
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Cursiva (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center transition ${
              editor.isActive('strike')
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Tachado"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center transition ${
              editor.isActive('code')
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Código Inline"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Blocks & Lists */}
        <div className="flex items-center border-r border-border/60 pr-1.5 mr-1 gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center transition ${
              editor.isActive('blockquote')
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Cita Editorial / Bloque"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center transition ${
              editor.isActive('bulletList')
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Lista con Viñetas"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center transition ${
              editor.isActive('orderedList')
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Lista Numerada"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center transition ${
              editor.isActive('codeBlock')
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Bloque de Código Seguro"
          >
            <CodeSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Media & Extensions */}
        <div className="flex items-center border-r border-border/60 pr-1.5 mr-1 gap-0.5 shrink-0">
          <button
            type="button"
            onClick={setLink}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center transition ${
              editor.isActive('link')
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Insertar Enlace"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenImageModal}
            className="min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title="Insertar Imagen / Subir a Supabase Storage"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Open Library Book Citation Button */}
          <button
            type="button"
            onClick={onOpenBookModal}
            className="min-h-[40px] px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition shrink-0"
            title="Insertar Ficha de Cita de Libro (Open Library API)"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Cita de Libro</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title="Separador Horizontal (HR)"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 transition"
            title="Deshacer (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 transition"
            title="Rehacer (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
