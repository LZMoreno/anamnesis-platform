'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Calendar, Edit3, Feather, Layers, LogIn, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { RoleSelector } from '@/components/role-selector';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Sparkles },
    { href: '/circulo/cronica', label: 'Crónica', icon: Feather },
    { href: '/circulo/ensayo-medico', label: 'Ensayo Médico', icon: BookOpen },
    { href: '/circulo/resena-literaria', label: 'Reseña Literaria', icon: Layers },
    { href: '/agenda', label: 'Agenda & Tutorías', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-wider text-primary">
              ANAMNESIS
            </span>
            <span className="hidden rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:inline-block">
              PLATAFORMA
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
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

        <div className="flex items-center gap-3">
          <RoleSelector />
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-9">
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ingresar</span>
            </Button>
          </Link>
          <Link href="/circulo/cronica/editor">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-primary hover:bg-primary/90">
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Panel Editor</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
