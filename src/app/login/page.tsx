'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, LogIn, PenTool, Shield } from 'lucide-react';
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
    <div className="container mx-auto max-w-md px-4 py-16">
      <Card className="shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="font-serif text-2xl">Ingresar a Anamnesis</CardTitle>
          <CardDescription className="text-xs">
            Accede a tu cuenta de lector, autor o editor.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Credential Fill Buttons */}
          <div className="space-y-2 rounded-lg bg-muted/40 p-3">
            <div className="text-[11px] font-semibold text-muted-foreground">
              Credenciales de Prueba (1 Clic):
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTestUser('reader')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded border bg-card text-[11px] hover:bg-accent transition"
              >
                <BookOpen className="w-3 h-3 text-sky-500" /> Lector
              </button>
              <button
                type="button"
                onClick={() => setTestUser('author')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded border bg-card text-[11px] hover:bg-accent transition"
              >
                <PenTool className="w-3 h-3 text-emerald-500" /> Autor
              </button>
              <button
                type="button"
                onClick={() => setTestUser('editor')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded border bg-card text-[11px] hover:bg-accent transition"
              >
                <Shield className="w-3 h-3 text-amber-500" /> Editor
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Correo Electrónico</label>
              <Input
                type="email"
                placeholder="ejemplo@anamnesis.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full text-xs gap-2" disabled={loading}>
              <LogIn className="w-3.5 h-3.5" />
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
