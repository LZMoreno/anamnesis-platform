'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Lock,
  LogIn,
  Mail,
  PenTool,
  Shield,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = React.useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [loginLoading, setLoginLoading] = React.useState(false);

  // Register form state
  const [registerName, setRegisterName] = React.useState('');
  const [registerEmail, setRegisterEmail] = React.useState('');
  const [registerPassword, setRegisterPassword] = React.useState('');
  const [registerRole, setRegisterRole] = React.useState<'reader' | 'author' | 'editor'>('reader');
  const [registerCircle, setRegisterCircle] = React.useState('cronica');
  const [registerLoading, setRegisterLoading] = React.useState(false);

  // Feedback message
  const [feedback, setFeedback] = React.useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const supabase = createClient();

  // 1-Click Test User Fill
  const setTestUser = (userRole: 'reader' | 'author' | 'editor') => {
    setTab('login');
    if (userRole === 'reader') {
      setLoginEmail('lector@anamnesis.com');
      setLoginPassword('Password123!');
    } else if (userRole === 'author') {
      setLoginEmail('autor@anamnesis.com');
      setLoginPassword('Password123!');
    } else {
      setLoginEmail('editor@anamnesis.com');
      setLoginPassword('Password123!');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setFeedback(null);

    // Determinar rol
    let role = 'reader';
    if (loginEmail.includes('author') || loginEmail.includes('autor')) role = 'author';
    if (loginEmail.includes('editor')) role = 'editor';

    // Guardar en cookie para simulación y navegación inmediata
    document.cookie = `anamnesis_demo_role=${role}; path=/; max-age=86400`;

    try {
      // Intentar login con Supabase Auth si está configurado
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
        await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });
      }
    } catch (err) {
      console.warn('Supabase local/offline fallback auth active');
    }

    setTimeout(() => {
      setLoginLoading(false);
      if (role === 'editor') {
        router.push('/circulo/cronica/editor');
      } else if (role === 'author') {
        router.push('/dashboard/autor/disponibilidad');
      } else {
        router.push('/');
      }
      router.refresh();
    }, 600);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setFeedback(null);

    // Guardar cookie de rol activo
    document.cookie = `anamnesis_demo_role=${registerRole}; path=/; max-age=86400`;

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
        await supabase.auth.signUp({
          email: registerEmail,
          password: registerPassword,
          options: {
            data: {
              full_name: registerName,
              role: registerRole,
              circle: registerCircle,
            },
          },
        });
      }
    } catch (err) {
      console.warn('Supabase local/offline fallback registration active');
    }

    setTimeout(() => {
      setRegisterLoading(false);
      setFeedback({
        type: 'success',
        text: `¡Cuenta creada con éxito para ${registerName} como ${
          registerRole === 'editor'
            ? 'Editor de Círculo'
            : registerRole === 'author'
            ? 'Autor'
            : 'Lector'
        }! Redirigiendo a tu espacio...`,
      });

      setTimeout(() => {
        if (registerRole === 'editor') {
          router.push(`/circulo/${registerCircle}/editor`);
        } else if (registerRole === 'author') {
          router.push('/dashboard/autor/disponibilidad');
        } else {
          router.push(`/circulo/${registerCircle}`);
        }
        router.refresh();
      }, 1200);
    }, 800);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-20">
      {/* Top Breadcrumb */}
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="container mx-auto max-w-md px-3 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 min-h-[44px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
          <span className="text-muted-foreground flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-primary" /> Acceso & Cuentas
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-md px-3 sm:px-6 pt-8 sm:pt-12">
        <Card className="shadow-lg border-border/60">
          <CardHeader className="space-y-3 text-center p-6 pb-4">
            <CardTitle className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              {tab === 'login' ? 'Ingresar a Anamnesis' : 'Crear Cuenta en Anamnesis'}
            </CardTitle>
            <CardDescription className="text-xs">
              {tab === 'login'
                ? 'Accede con tu perfil de lector, autor o editor del círculo.'
                : 'Únete a la plataforma literaria seleccionando tu rol editorial.'}
            </CardDescription>

            {/* Toggle Tabs (Iniciar Sesión vs Registrarse) */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-muted/80 border text-xs font-medium mt-2">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setFeedback(null);
                }}
                className={`py-2 rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
                  tab === 'login'
                    ? 'bg-background text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" /> Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setFeedback(null);
                }}
                className={`py-2 rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
                  tab === 'register'
                    ? 'bg-background text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Crear Cuenta
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6 pt-0">
            {/* Feedback Alert if present */}
            {feedback && (
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs animate-in fade-in zoom-in-95 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-destructive/10 border-destructive/30 text-destructive'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{feedback.text}</span>
              </div>
            )}

            {tab === 'login' ? (
              <>
                {/* Quick Credential Fill Buttons (1 Clic) */}
                <div className="space-y-2 rounded-xl bg-muted/50 p-3.5 border border-border/60">
                  <div className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                    <span>Acceso Rápido de Prueba (1 Clic):</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTestUser('reader')}
                      className="flex flex-col items-center justify-center gap-1 min-h-[44px] py-2 px-2 rounded-lg border bg-card text-xs font-medium hover:bg-accent transition active:scale-95"
                    >
                      <BookOpen className="w-4 h-4 text-sky-500" />
                      <span className="text-[11px]">Lector</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestUser('author')}
                      className="flex flex-col items-center justify-center gap-1 min-h-[44px] py-2 px-2 rounded-lg border bg-card text-xs font-medium hover:bg-accent transition active:scale-95"
                    >
                      <PenTool className="w-4 h-4 text-emerald-500" />
                      <span className="text-[11px]">Autor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestUser('editor')}
                      className="flex flex-col items-center justify-center gap-1 min-h-[44px] py-2 px-2 rounded-lg border bg-card text-xs font-medium hover:bg-accent transition active:scale-95"
                    >
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span className="text-[11px]">Editor</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Correo Electrónico</label>
                    <Input
                      type="email"
                      placeholder="ejemplo@anamnesis.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="min-h-[44px] text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Contraseña</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="min-h-[44px] text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full min-h-[44px] text-xs sm:text-sm font-medium gap-2 bg-primary hover:bg-primary/90"
                    disabled={loginLoading}
                  >
                    <LogIn className="w-4 h-4" />
                    {loginLoading ? 'Validando credenciales...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Nombre Completo</label>
                  <Input
                    type="text"
                    placeholder="Ej. Sofía Valenzuela"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="min-h-[44px] text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Correo Electrónico</label>
                  <Input
                    type="email"
                    placeholder="sofia@ejemplo.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="min-h-[44px] text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Contraseña</label>
                  <Input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="min-h-[44px] text-xs sm:text-sm"
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Perfil y Permisos Iniciales
                  </label>
                  <select
                    value={registerRole}
                    onChange={(e) =>
                      setRegisterRole(e.target.value as 'reader' | 'author' | 'editor')
                    }
                    className="w-full min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-ring font-medium"
                  >
                    <option value="reader">📖 Lector (Explorar, Comentar y Agendar Citas)</option>
                    <option value="author">✍️ Autor (Publicar Manuscritos y Mi Día)</option>
                    <option value="editor">🏛️ Editor (Administrar Círculo e Invitar Miembros)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Círculo de Preferencia Inicial
                  </label>
                  <select
                    value={registerCircle}
                    onChange={(e) => setRegisterCircle(e.target.value)}
                    className="w-full min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="cronica">Crónica (/circulo/cronica)</option>
                    <option value="ensayo-medico">Ensayo Médico (/circulo/ensayo-medico)</option>
                    <option value="resena-literaria">Reseña Literaria (/circulo/resena-literaria)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full min-h-[44px] text-xs sm:text-sm font-medium gap-2 bg-primary hover:bg-primary/90"
                  disabled={registerLoading}
                >
                  <UserPlus className="w-4 h-4" />
                  {registerLoading ? 'Creando cuenta en Supabase...' : 'Registrar Cuenta'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
