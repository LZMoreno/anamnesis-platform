'use client';

import * as React from 'react';
import { Image as ImageIcon, Link as LinkIcon, Loader2, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (url: string, alt?: string, caption?: string) => void;
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onInsertImage,
}: ImageUploadModalProps) {
  const [activeTab, setActiveTab] = React.useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = React.useState('');
  const [altText, setAltText] = React.useState('');
  const [caption, setCaption] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    onInsertImage(imageUrl, altText, caption);
    onClose();
    setImageUrl('');
    setAltText('');
    setCaption('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'articles');

      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (json.success && json.url) {
        setImageUrl(json.url);
        if (!altText) setAltText(file.name.replace(/\.[^/.]+$/, ''));
      } else {
        setUploadError(json.error || 'Error subiendo la imagen a Supabase Storage.');
      }
    } catch (err: any) {
      console.error('Error en subida de archivo:', err);
      setUploadError('Error de red al conectar con el servidor de almacenamiento.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-bold text-base">Insertar Imagen</h3>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-border/40 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-3 min-h-[44px] flex items-center justify-center gap-1.5 transition ${
              activeTab === 'url'
                ? 'border-b-2 border-primary text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> Enlace URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 min-h-[44px] flex items-center justify-center gap-1.5 transition ${
              activeTab === 'upload'
                ? 'border-b-2 border-primary text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" /> Subir a Supabase Storage
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleInsert} className="p-4 sm:p-5 space-y-4">
          {activeTab === 'url' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">URL de la Imagen</label>
              <Input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="min-h-[44px] text-xs"
                required
                autoFocus
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-medium text-foreground">
                Seleccionar archivo del dispositivo
              </label>
              <div className="border-2 border-dashed border-border/80 rounded-xl p-5 text-center hover:border-primary/60 transition cursor-pointer relative bg-muted/20">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-1" />
                <div className="text-xs font-medium">Arrastra una imagen o haz clic para buscar</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WebP, GIF hasta 10MB</div>
              </div>

              {uploading && (
                <div className="flex items-center gap-2 text-xs text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" /> Subiendo al bucket seguro de Supabase Storage...
                </div>
              )}

              {uploadError && (
                <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                  {uploadError}
                </div>
              )}

              {imageUrl && !uploading && (
                <div className="text-xs text-emerald-600 font-medium">
                  ✓ Imagen cargada exitosamente en el servidor
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Texto Alternativo (Alt)</label>
            <Input
              type="text"
              placeholder="Descripción para accesibilidad..."
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="min-h-[44px] text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-h-[44px] text-xs font-medium"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!imageUrl || uploading}
              className="min-h-[44px] text-xs font-medium bg-primary hover:bg-primary/90"
            >
              Insertar en Manuscrito
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
