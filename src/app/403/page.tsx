import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="container mx-auto max-w-lg px-4 py-24 text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
          403 • Acceso Restringido
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Esta sección o manuscrito requiere privilegios de rol <strong>Editor</strong> o pertenecer a la mesa de redacción correspondiente.
        </p>
      </div>

      <div className="rounded-lg bg-muted/40 p-4 text-xs text-muted-foreground border border-border/40 text-left space-y-1">
        <div className="font-medium text-foreground flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-amber-500" /> Control de Acceso RBAC:
        </div>
        <p>• Los lectores no pueden acceder a los paneles de edición de círculos ajenos ni a borradores no publicados.</p>
        <p>• Puedes cambiar tu rol de prueba con el selector superior de la barra de navegación.</p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Link href="/">
          <Button variant="default" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a la Portada
          </Button>
        </Link>
      </div>
    </div>
  );
}
