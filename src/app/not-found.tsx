import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-md px-4 py-24 text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileQuestion className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold">404 • Manuscrito no encontrado</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          El artículo o círculo que buscas no existe o ha sido archivado por la mesa editorial.
        </p>
      </div>

      <Link href="/">
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Regresar al Inicio
        </Button>
      </Link>
    </div>
  );
}
