import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden pb-20">
      <div className="container mx-auto max-w-lg px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            403 • Acceso Restringido
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Esta sección o manuscrito requiere privilegios de rol <strong>Editor</strong> o pertenecer a la mesa de redacción del círculo correspondiente.
          </p>
        </div>

        <div className="rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground border border-border/40 text-left space-y-2">
          <div className="font-semibold text-foreground flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-500" /> Control de Acceso RBAC:
          </div>
          <p className="leading-relaxed">• Los lectores no pueden acceder a los paneles de edición de círculos ajenos ni a borradores no publicados.</p>
          <p className="leading-relaxed">• Puedes cambiar tu rol de prueba con el selector superior de la barra de navegación para acceder como <strong>Editor</strong>.</p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Link href="/">
            <Button className="min-h-[44px] gap-2 text-xs font-medium bg-primary hover:bg-primary/90 px-6">
              <ArrowLeft className="w-4 h-4" /> Volver a la Portada
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
