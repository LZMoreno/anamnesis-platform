'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  BookOpen,
  CalendarCheck,
  Check,
  Compass,
  Edit3,
  LogOut,
  PenTool,
  Shield,
  Sparkles,
  User,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { INITIAL_AUTHORS } from '@/lib/data/mock-db';

interface UserAccountNavProps {
  onRoleChange?: (newRole: string) => void;
}

export function UserAccountNav({ onRoleChange }: UserAccountNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = React.useState<string>('reader');
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const match = document.cookie.match(/anamnesis_demo_role=([^;]+)/);
    if (match) {
      setCurrentRole(match[1]);
    } else {
      // Por defecto arrancar como lector o invitado
      setCurrentRole('reader');
    }
  }, [pathname]);

  const selectRole = (role: 'guest' | 'reader' | 'author' | 'editor') => {
    if (role === 'guest') {
      document.cookie = `anamnesis_demo_role=guest; path=/; max-age=86400`;
      setCurrentRole('guest');
    } else {
      document.cookie = `anamnesis_demo_role=${role}; path=/; max-age=86400`;
      setCurrentRole(role);
    }
    setIsOpen(false);
    if (onRoleChange) onRoleChange(role);
    router.refresh();
  };

  const handleLogout = () => {
    document.cookie = `anamnesis_demo_role=guest; path=/; max-age=86400`;
    setCurrentRole('guest');
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  // Obtener perfil del usuario activo
  const getUserProfile = () => {
    switch (currentRole) {
      case 'editor':
        return {
          name: 'Elena Rocafuerte',
          email: 'editor@anamnesis.com',
          roleLabel: 'Editora General',
          roleBadge: 'editor',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          initials: 'ER',
        };
      case 'author':
        return {
          name: 'Dr. Julián Sotomayor',
          email: 'autor@anamnesis.com',
          roleLabel: 'Médico Ensayista',
          roleBadge: 'author',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          initials: 'JS',
        };
      case 'reader':
        return {
          name: 'Sofía Valenzuela',
          email: 'lector@anamnesis.com',
          roleLabel: 'Lectora & Investigadora',
          roleBadge: 'reader',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          initials: 'SV',
        };
      default:
        return null;
    }
  };

  const user = getUserProfile();

  // MODO INVITADO / SIN CUENTA
  if (currentRole === 'guest' || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button
            size="sm"
            className="min-h-[40px] text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 px-3.5 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Iniciar Sesión / Registro</span>
          </Button>
        </Link>
      </div>
    );
  }

  // MODO AUTENTICADO: AVATAR + NOMBRE + ROL
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-h-[44px] py-1 px-2 rounded-full border border-border/70 bg-card hover:bg-accent/60 transition shadow-sm"
        title={`Sesión iniciada como ${user.name} (${user.roleLabel})`}
      >
        <Avatar
          src={user.avatarUrl}
          fallback={user.initials}
          className="w-7 h-7 border border-primary/30 shrink-0"
        />

        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-xs font-semibold text-foreground leading-tight">
            {user.name.split(' ')[0]}
          </span>
          <span className="text-[10px] text-muted-foreground leading-none">
            {currentRole === 'editor'
              ? 'Editor'
              : currentRole === 'author'
              ? 'Autor'
              : 'Lector'}
          </span>
        </div>

        {currentRole === 'editor' && (
          <Badge className="bg-amber-600 text-white text-[10px] px-1.5 py-0 hidden md:inline-flex">
            <Shield className="w-3 h-3 mr-0.5" /> Editor
          </Badge>
        )}
        {currentRole === 'author' && (
          <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0 hidden md:inline-flex">
            <PenTool className="w-3 h-3 mr-0.5" /> Autor
          </Badge>
        )}
        {currentRole === 'reader' && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 hidden md:inline-flex">
            <BookOpen className="w-3 h-3 mr-0.5" /> Lector
          </Badge>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border/80 bg-card p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
            {/* Header with User Info */}
            <div className="flex items-center gap-3 pb-3 border-b border-border/50">
              <Avatar
                src={user.avatarUrl}
                fallback={user.initials}
                className="w-11 h-11 border-2 border-primary/20 shrink-0"
              />
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="font-serif font-bold text-sm text-foreground truncate">
                  {user.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
                <div className="pt-0.5">
                  <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {user.roleLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Links depending on role */}
            <div className="py-2.5 space-y-1 border-b border-border/50 text-xs">
              {currentRole === 'editor' && (
                <>
                  <Link
                    href="/circulo/cronica/editor"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-accent text-foreground font-medium transition"
                  >
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span>Mesa Editorial del Círculo</span>
                  </Link>
                  <Link
                    href="/circulo/cronica/editor/members"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-accent text-foreground font-medium transition"
                  >
                    <Users className="w-4 h-4 text-primary" />
                    <span>Gestión de Miembros & Autores</span>
                  </Link>
                </>
              )}

              {currentRole === 'author' && (
                <>
                  <Link
                    href="/dashboard/autor/disponibilidad"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-accent text-foreground font-medium transition"
                  >
                    <CalendarCheck className="w-4 h-4 text-emerald-500" />
                    <span>Mi Día & Bloques de Disponibilidad</span>
                  </Link>
                  <Link
                    href="/editor/nuevo"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-accent text-foreground font-medium transition"
                  >
                    <PenTool className="w-4 h-4 text-primary" />
                    <span>Redactar en TipTap con Gemini IA</span>
                  </Link>
                </>
              )}

              <Link
                href="/explorar"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition"
              >
                <Compass className="w-4 h-4" />
                <span>Explorar Biblioteca & Marcadores</span>
              </Link>
            </div>

            {/* Switch test accounts */}
            <div className="py-2.5 border-b border-border/50">
              <div className="text-[11px] font-semibold text-muted-foreground px-1 mb-1.5">
                Cambiar de Cuenta de Prueba:
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => selectRole('reader')}
                  className={`p-1.5 rounded-lg border text-center text-[11px] font-medium transition ${
                    currentRole === 'reader'
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-border/60 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  📖 Sofía (Lector)
                </button>
                <button
                  onClick={() => selectRole('author')}
                  className={`p-1.5 rounded-lg border text-center text-[11px] font-medium transition ${
                    currentRole === 'author'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 font-bold'
                      : 'border-border/60 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  ✍️ Julián (Autor)
                </button>
                <button
                  onClick={() => selectRole('editor')}
                  className={`p-1.5 rounded-lg border text-center text-[11px] font-medium transition ${
                    currentRole === 'editor'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 font-bold'
                      : 'border-border/60 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  🏛️ Elena (Editor)
                </button>
              </div>
            </div>

            {/* Logout / Guest Mode */}
            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 min-h-[40px] px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión (Modo Invitado Sin Rol)</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
