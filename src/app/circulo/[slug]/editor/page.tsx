'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  FileText,
  Lock,
  Plus,
  Shield,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { getCircleBySlug, INITIAL_MEMBERS } from '@/lib/data/mock-db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EditorPageProps {
  params: {
    slug: string;
  };
}

export default function CircleEditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const circle = getCircleBySlug(params.slug);
  const [currentRole, setCurrentRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const match = document.cookie.match(/anamnesis_demo_role=([^;]+)/);
    const role = match ? match[1] : 'reader';
    setCurrentRole(role);
  }, []);

  if (!circle) {
    notFound();
  }

  // Estricto Guard de Rol: Si es Lector o Autor no editor, bloquear acceso totalmente
  if (currentRole !== null && currentRole !== 'editor') {
    return (
      <div className="w-full max-w-full overflow-x-hidden pb-20">
        <div className="container mx-auto max-w-lg px-4 py-16 sm:py-24 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              403 • Acceso Denegado
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              La Mesa Editorial de <strong>{circle.name}</strong> es un espacio privado. Tu rol actual (<strong>{currentRole === 'author' ? 'Autor' : 'Lector'}</strong>) no posee permisos de administración para este círculo.
            </p>
          </div>

          <div className="rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground border border-border/40 text-left space-y-2">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-500" /> Política de Seguridad RLS:
            </div>
            <p>• Los lectores nunca tienen acceso a la cola de borradores ni a la gestión de membresías.</p>
            <p>• Para ingresar como editor, selecciona el rol <strong>Editor</strong> en el simulador superior.</p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Link href={`/circulo/${params.slug}`}>
              <Button className="min-h-[44px] gap-2 text-xs font-medium bg-primary hover:bg-primary/90 px-6">
                <ArrowLeft className="w-4 h-4" /> Volver a la Vista Pública
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const membersCount = (INITIAL_MEMBERS[params.slug] || []).length;

  const manuscripts = [
    {
      id: '44444444-4444-4444-4444-444444444441',
      slug: 'el-peso-de-la-palabra-no-dicha',
      title: 'El peso de la palabra no dicha: Apuntes sobre la anamnesis en urgencias',
      author: 'Dr. Julián Sotomayor',
      status: 'published',
      date: '01/09/2026',
      readingTime: '7 min',
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      slug: 'anatomia-del-error-medico',
      title: 'Borrador: La anatomía del error médico y el tabú hospitalario',
      author: 'Dr. Julián Sotomayor',
      status: 'draft',
      date: '31/08/2026',
      readingTime: '5 min',
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-20">
      {/* Top Breadcrumb Header */}
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="container mx-auto max-w-6xl px-3 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href={`/circulo/${params.slug}`}
            className="flex items-center gap-1.5 min-h-[44px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a la vista pública del círculo
          </Link>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-foreground">{circle.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-3 sm:px-6 pt-6 sm:pt-10 space-y-8">
        {/* Editor Title & Navigation Tabs */}
        <div className="space-y-4 pb-4 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                  Mesa Editorial: {circle.name}
                </h1>
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white gap-1 text-[11px]">
                  <Shield className="w-3 h-3" /> Editor
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Gestión de manuscritos, revisión de borradores y control de publicaciones.
              </p>
            </div>

            <Link href="/editor/nuevo" className="self-start sm:self-auto">
              <Button
                className="min-h-[44px] gap-2 text-xs font-medium bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" /> Redactar en TipTap
              </Button>
            </Link>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 pt-2">
            <Link href={`/circulo/${params.slug}/editor`}>
              <Button
                variant="secondary"
                className="min-h-[44px] gap-2 text-xs font-semibold bg-accent text-accent-foreground shadow-sm"
              >
                <FileText className="w-4 h-4 text-primary" />
                Cola de Manuscritos
              </Button>
            </Link>
            <Link href={`/circulo/${params.slug}/editor/members`}>
              <Button
                variant="ghost"
                className="min-h-[44px] gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <Users className="w-4 h-4" />
                Miembros & Autores ({membersCount})
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-xs">Artículos Publicados</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                1
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <span className="text-[11px] text-muted-foreground">Visibles a todos los lectores</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-xs">Borradores en Revisión</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-serif font-bold text-amber-500">
                1
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <span className="text-[11px] text-muted-foreground">Privado solo para autores y editores</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-xs">Membresías del Círculo</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {circle.memberCount}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <Link
                href={`/circulo/${params.slug}/editor/members`}
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Gestionar miembros →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Manuscripts Table */}
        <Card className="shadow-sm">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <CardTitle className="text-lg font-serif font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Manuscritos Registrados
            </CardTitle>
            <CardDescription className="text-xs">
              Listado completo de textos registrados en la base de datos PostgreSQL de este círculo.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="divide-y divide-border/40">
              {manuscripts.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-semibold text-sm text-foreground">
                        {item.title}
                      </span>
                      {item.status === 'published' ? (
                        <Badge
                          variant="default"
                          className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Publicado
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        >
                          Borrador en Revisión
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Autor: {item.author} • {item.readingTime} • {item.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link href={`/editor/${item.slug}`}>
                      <Button
                        variant="outline"
                        className="min-h-[44px] text-xs gap-1.5 font-medium px-3"
                      >
                        <Edit className="w-4 h-4 text-primary" /> Abrir en TipTap
                      </Button>
                    </Link>
                    <Link href={`/circulo/${params.slug}/articulos/${item.slug}`}>
                      <Button
                        variant="ghost"
                        className="min-h-[44px] text-xs gap-1.5 font-medium px-3"
                      >
                        <Eye className="w-4 h-4" /> Vista Previa
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
