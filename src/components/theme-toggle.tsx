'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="min-h-[44px] min-w-[44px] opacity-70"
        aria-label="Cargando tema"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <Button
      variant="outline"
      onClick={cycleTheme}
      className="min-h-[44px] gap-2 px-3 border-border/60 hover:bg-accent/50 text-xs font-medium rounded-full transition-all"
      title="Cambiar tema (Claro / Oscuro / Sistema)"
      aria-label="Cambiar tema de color"
    >
      {theme === 'dark' ? (
        <>
          <Moon className="h-4 w-4 text-indigo-400 animate-in fade-in zoom-in-75 duration-200" />
          <span className="hidden sm:inline">Oscuro</span>
        </>
      ) : theme === 'light' ? (
        <>
          <Sun className="h-4 w-4 text-amber-500 animate-in fade-in zoom-in-75 duration-200" />
          <span className="hidden sm:inline">Claro</span>
        </>
      ) : (
        <>
          <Monitor className="h-4 w-4 text-muted-foreground animate-in fade-in zoom-in-75 duration-200" />
          <span className="hidden sm:inline">Auto</span>
        </>
      )}
    </Button>
  );
}
