'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, LogIn, PenTool, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const setTestUser = (userRole: 'reader' | 'author' | 'editor') => {
    if (userRole === 'reader') {
      setEmail('lector@anamnesis.com');
      setPassword('Password123!');
    } else if (userRole === 'author') {
      setEmail('autor@anamnesis.com');
      setPassword('Password123!');
    } else {
      setEmail('editor@anamnesis.com');
      setPassword('Password123!');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Asignar rol correspondiente a la cookie para la sesión
    let role = 'reader';
    if (email.includes('author') || email.includes('autor')) role = 'author';
    if (email.includes('editor')) role = 'editor';

    document.cookie = `anamnesis_demo_role=${role}; path=/; max-age=86400`;

    setTimeout(() => {
      setLoading(false);
      if (role === 'editor') {
        router.push('/circulo/cronica/editor');
      } else {
        router.push('/');
      }
      router.refresh();
    }, 600);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-20">
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="container mx-auto max-w-md px-3 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 min-h-[44px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
          <span className="text-muted-foreground">Acceso Seguro</span>
        </div>
      </div>

      <div className="container mx-auto max-w-md px-3 sm:px-6 pt-10 sm:pt-14">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 text-center p-6 pb-4">
            <CardTitle className="font-serif text-2xl sm:text-3xl font-bold">
              Ingresar a Anamnesis
            </CardTitle>
            <CardDescription className="text-xs">
              Accede a tu cuenta de lector, autor o editor.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6 pt-0">
            {/* Quick Credential Fill Buttons */}
            <div className="space-y-2 rounded-xl bg-muted/50 p-3.5 border border-border/60">
              <div className="text-xs font-semibold text-muted-foreground">
                Credenciales de Prueba (1 Clic):
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTestUser('reader')}
                  className="flex items-center justify-center gap-1.5 min-h-[44px] py-2 px-2 rounded-lg border bg-card text-xs font-medium hover:bg-accent transition active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-500 shrink-0" /> Lector
                </button>
                <button
                  type="button"
                  onClick={() => setTestUser('author')}
                  className="flex items-center justify-center gap-1.5 min-h-[44px] py-2 px-2 rounded-lg border bg-card text-xs font-medium hover:bg-accent transition active:scale-95"
                >
                  <PenTool className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Autor
                </button>
                <button
                  type="button"
                  onClick={() => setTestUser('editor')}
                  className="flex items-center justify-center gap-1.5 min-h-[44px] py-2 px-2 rounded-lg border bg-card text-xs font-medium hover:bg-accent transition active:scale-95"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Editor
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Correo Electrónico</label>
                <Input
                  type="email"
                  placeholder="ejemplo@anamnesis.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[44px] text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-[44px] text-xs sm:text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full min-h-[44px] text-xs sm:text-sm font-medium gap-2 bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Validando credenciales...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
