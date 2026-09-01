'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  CalendarCheck,
  ChevronRight,
  Compass,
  Edit3,
  Feather,
  Layers,
  LogIn,
  Menu,
  PenTool,
  Search,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { RoleSelector } from '@/components/role-selector';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState<string>('reader');

  React.useEffect(() => {
    const match = document.cookie.match(/anamnesis_demo_role=([^;]+)/);
    if (match) {
      setCurrentRole(match[1]);
    }
  }, [pathname]);

  // Cerrar menú móvil al cambiar de ruta
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Sparkles },
    { href: '/circulos', label: 'Círculos', icon: Layers },
    { href: '/explorar', label: 'Explorar', icon: Compass },
    { href: '/agenda', label: 'Agenda (30m)', icon: Calendar },
    {
      href: '/dashboard/autor/disponibilidad',
      label: 'Mi Día',
      icon: CalendarCheck,
    },
    {
      href: '/editor/nuevo',
      label: 'Redactar',
      icon: PenTool,
    },
  ];

  const isEditor = currentRole === 'editor';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 transition-colors">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 min-h-[44px] py-1 text-foreground"
          >
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-primary">
              ANAMNESIS
            </span>
            <span className="hidden rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:inline-block">
              PLATAFORMA
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href === '/editor/nuevo' && pathname.startsWith('/editor')) ||
                (link.href === '/dashboard/autor/disponibilidad' && pathname.startsWith('/dashboard/autor')) ||
                (link.href === '/circulos' && pathname.startsWith('/circulos')) ||
                (link.href === '/explorar' && pathname.startsWith('/explorar'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-2 min-h-[44px] text-xs font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop & Mobile Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <RoleSelector />
          </div>
          <ThemeToggle />

          <Link href="/login" className="hidden sm:inline-block">
            <Button
              variant="outline"
              className="min-h-[44px] gap-1.5 text-xs font-medium px-3 border-border/80 hover:bg-accent"
              title="Iniciar sesión o registrar cuenta"
            >
              <User className="w-4 h-4 text-primary" />
              <span>Cuenta</span>
            </Button>
          </Link>

          {isEditor && (
            <Link
              href="/circulo/cronica/editor"
              className="hidden md:inline-block"
            >
              <Button
                className="min-h-[44px] gap-1.5 text-xs font-medium bg-primary hover:bg-primary/90 px-3.5"
              >
                <Edit3 className="w-4 h-4" />
                <span>Mesa Editorial</span>
              </Button>
            </Link>
          )}

          {/* Mobile Hamburger Toggle Button (min 44x44px touch target) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent transition"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border/60 bg-background px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <span className="text-xs font-semibold text-muted-foreground">
              Simulador RBAC Móvil:
            </span>
            <RoleSelector />
          </div>

          {/* Navigation Links (Mobile) */}
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href === '/editor/nuevo' && pathname.startsWith('/editor')) ||
                (link.href === '/dashboard/autor/disponibilidad' && pathname.startsWith('/dashboard/autor')) ||
                (link.href === '/circulos' && pathname.startsWith('/circulos')) ||
                (link.href === '/explorar' && pathname.startsWith('/explorar'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-3 min-h-[44px] text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}

            <Link
              href="/login"
              className="flex items-center justify-between px-3 py-3 min-h-[44px] text-sm font-medium rounded-lg text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-primary" />
                <span>Iniciar Sesión / Cuenta</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Link>
          </nav>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
            <Link href="/dashboard/autor/disponibilidad" className="w-full">
              <Button
                variant="outline"
                className="w-full min-h-[44px] gap-2 text-xs font-medium"
              >
                <CalendarCheck className="w-4 h-4" /> Mi Día & Slots
              </Button>
            </Link>
            {isEditor ? (
              <Link href="/circulo/cronica/editor" className="w-full">
                <Button
                  className="w-full min-h-[44px] gap-2 text-xs font-medium bg-primary hover:bg-primary/90"
                >
                  <Edit3 className="w-4 h-4" /> Mesa Editorial
                </Button>
              </Link>
            ) : (
              <Link href="/circulos" className="w-full">
                <Button
                  className="w-full min-h-[44px] gap-2 text-xs font-medium bg-primary hover:bg-primary/90"
                >
                  <Layers className="w-4 h-4" /> Ver Círculos
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
