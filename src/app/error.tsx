'use client';

import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-md px-4 py-24 text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-2xl font-bold">Ha ocurrido un error en la aplicación</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {error.message || 'No fue posible completar la solicitud.'}
        </p>
      </div>

      <Button onClick={() => reset()} size="sm" className="gap-1.5 text-xs">
        <RefreshCw className="w-3.5 h-3.5" /> Reintentar
      </Button>
    </div>
  );
}
