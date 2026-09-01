'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, BookOpen, PenTool, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function RoleSelector() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = React.useState<string>('reader');
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const match = document.cookie.match(/anamnesis_demo_role=([^;]+)/);
    if (match) {
      setCurrentRole(match[1]);
    }
  }, []);

  const selectRole = (role: 'reader' | 'author' | 'editor') => {
    document.cookie = `anamnesis_demo_role=${role}; path=/; max-age=86400`;
    setCurrentRole(role);
    setIsOpen(false);
    router.refresh();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'editor':
        return (
          <Badge className="bg-amber-600 hover:bg-amber-700 text-white gap-1 text-[11px] px-2 py-0.5">
            <Shield className="w-3 h-3" /> Editor
          </Badge>
        );
      case 'author':
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-[11px] px-2 py-0.5">
            <PenTool className="w-3 h-3" /> Autor
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1 text-[11px] px-2 py-0.5">
            <BookOpen className="w-3 h-3" /> Lector
          </Badge>
        );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-full border border-border/80 bg-muted/40 hover:bg-muted text-xs font-medium transition"
        title="Cambiar rol activo para probar permisos RBAC"
      >
        <span className="text-muted-foreground hidden md:inline">Rol activo:</span>
        {getRoleBadge(currentRole)}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-xl border bg-card p-3 shadow-xl z-50 animate-in fade-in zoom-in-95">
            <div className="text-xs font-semibold text-muted-foreground mb-2 px-1">
              Simular Permisos (RBAC):
            </div>

            <div className="space-y-1">
              <button
                onClick={() => selectRole('reader')}
                className="w-full flex items-center justify-between min-h-[44px] p-2.5 rounded-lg text-xs hover:bg-accent text-left transition"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-sky-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Lector (Sofía)</div>
                    <div className="text-[10px] text-muted-foreground">Lectura y comentarios públicos</div>
                  </div>
                </div>
                {currentRole === 'reader' && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>

              <button
                onClick={() => selectRole('author')}
                className="w-full flex items-center justify-between min-h-[44px] p-2.5 rounded-lg text-xs hover:bg-accent text-left transition"
              >
                <div className="flex items-center gap-2.5">
                  <PenTool className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Autor (Dr. Julián)</div>
                    <div className="text-[10px] text-muted-foreground">Crear artículos y agenda</div>
                  </div>
                </div>
                {currentRole === 'author' && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>

              <button
                onClick={() => selectRole('editor')}
                className="w-full flex items-center justify-between min-h-[44px] p-2.5 rounded-lg text-xs hover:bg-accent text-left transition"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Editor (Elena)</div>
                    <div className="text-[10px] text-muted-foreground">Acceso a /circulo/[slug]/editor/*</div>
                  </div>
                </div>
                {currentRole === 'editor' && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
