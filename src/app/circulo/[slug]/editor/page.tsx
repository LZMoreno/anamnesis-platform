'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  FileText,
  Lock,
  MessageSquare,
  MessageSquareWarning,
  Plus,
  Radio,
  Reply,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  getCircleBySlug,
  INITIAL_MEMBERS,
  INITIAL_ARTICLES,
  INITIAL_COMMENTS,
} from '@/lib/data/mock-db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface EditorPageProps {
  params: {
    slug: string;
  };
}

export default function CircleEditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const circle = getCircleBySlug(params.slug);
  const [currentRole, setCurrentRole] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'manuscripts' | 'comments'>('overview');

  React.useEffect(() => {
    const match = document.cookie.match(/anamnesis_demo_role=([^;]+)/);
    const role = match ? match[1] : 'reader';
    setCurrentRole(role);
  }, []);

  if (!circle) {
    notFound();
  }

  // Estricto Guard de Rol: Si es Lector o Invitado, bloquear acceso totalmente
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
            <p>• Los lectores nunca tienen acceso al panel de métricas ni a la gestión de membresías.</p>
            <p>• Para ingresar como editor, inicia sesión con la cuenta de <strong>Elena Rocafuerte (Editor)</strong>.</p>
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

  const circleArticles = INITIAL_ARTICLES.filter((a) => a.circleSlug === params.slug);
  const publishedCount = circleArticles.filter((a) => a.status === 'published').length;
  const draftCount = circleArticles.filter((a) => a.status === 'draft').length || 1;
  const totalReads = 1420;
  const unattendedCommentsCount = INITIAL_COMMENTS.filter((c) => !c.replies || c.replies.length === 0).length;
  const membersCount = (INITIAL_MEMBERS[params.slug] || []).length;

  // Gráfica de lecturas semanales (Compatible con Dark Mode)
  const weeklyTraffic = [
    { day: 'Lun', reads: 140, comments: 4 },
    { day: 'Mar', reads: 220, comments: 8 },
    { day: 'Mié', reads: 310, comments: 12 },
    { day: 'Jue', reads: 280, comments: 9 },
    { day: 'Vie', reads: 450, comments: 15 },
    { day: 'Sáb', reads: 520, comments: 18 },
    { day: 'Dom', reads: 380, comments: 11 },
  ];

  const maxReads = Math.max(...weeklyTraffic.map((d) => d.reads));

  // Artículos más leídos del círculo
  const topReadArticles = [
    {
      title: 'El peso de la palabra no dicha: Apuntes sobre la anamnesis en urgencias',
      author: 'Dr. Julián Sotomayor',
      reads: 890,
      comments: 6,
      readingTime: '7 min',
      slug: 'el-peso-de-la-palabra-no-dicha',
    },
    {
      title: 'Crónica del tercer turno: El silencio en el pabellón de traumatología',
      author: 'Elena Rocafuerte',
      reads: 340,
      comments: 4,
      readingTime: '6 min',
      slug: 'cronica-del-tercer-turno',
    },
    {
      title: 'La invención de la enfermedad: Foucault revisitado en la clínica',
      author: 'Dr. Julián Sotomayor',
      reads: 190,
      comments: 2,
      readingTime: '5 min',
      slug: 'la-invencion-de-la-enfermedad',
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-24">
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
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  Panel Editorial: {circle.name}
                </h1>
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white gap-1 text-[11px]">
                  <Shield className="w-3 h-3" /> Mesa Directiva
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Supervisión analítica de publicaciones, borradores, lecturas y moderación comunitaria.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/editor/nuevo">
                <Button className="min-h-[44px] gap-2 text-xs font-medium bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" /> Redactar Manuscrito
                </Button>
              </Link>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
            <Button
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              className={`min-h-[44px] gap-2 text-xs font-semibold ${
                activeTab === 'overview' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-primary" />
              Métricas & Tráfico
            </Button>

            <Button
              variant={activeTab === 'manuscripts' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('manuscripts')}
              className={`min-h-[44px] gap-2 text-xs font-medium ${
                activeTab === 'manuscripts' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <FileText className="w-4 h-4" />
              Cola de Manuscritos ({circleArticles.length})
            </Button>

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

        {/* 1. Dashboard de Métricas Clave (4 Cards) */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 sm:p-5">
            <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between">
              <CardDescription className="text-xs font-medium">Publicados</CardDescription>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {publishedCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Ensayos en línea</p>
            </CardContent>
          </Card>

          <Card className="p-4 sm:p-5">
            <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between">
              <CardDescription className="text-xs font-medium">Borradores Pendientes</CardDescription>
              <Clock className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-500">
                {draftCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">En revisión editorial</p>
            </CardContent>
          </Card>

          <Card className="p-4 sm:p-5">
            <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between">
              <CardDescription className="text-xs font-medium">Lecturas Totales</CardDescription>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-primary">
                {totalReads.toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Vistas en el círculo</p>
            </CardContent>
          </Card>

          <Card className="p-4 sm:p-5">
            <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between">
              <CardDescription className="text-xs font-medium">Comentarios sin Atender</CardDescription>
              <MessageSquareWarning className="w-4 h-4 text-rose-500" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-500">
                {unattendedCommentsCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Hilos sin respuesta</p>
            </CardContent>
          </Card>
        </div>

        {/* 2. Gráfica Interactiva de Actividad Semanal (Diseñada para Dark Mode & Móvil) */}
        <Card className="shadow-sm">
          <CardHeader className="p-5 sm:p-6 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="font-serif text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Actividad y Tráfico Semanal del Círculo
                </CardTitle>
                <CardDescription className="text-xs">
                  Evolución de lecturas acumuladas e interacciones por día de la semana.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[11px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 self-start sm:self-auto">
                +24% vs semana anterior
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-4">
            {/* SVG / CSS Bar Chart */}
            <div className="space-y-3">
              <div className="h-44 sm:h-52 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 px-1 border-b border-border/60">
                {weeklyTraffic.map((item) => {
                  const heightPercent = Math.round((item.reads / maxReads) * 100);

                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      {/* Tooltip on Hover */}
                      <span className="text-[10px] text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.reads} lect.
                      </span>

                      {/* Bar Fill */}
                      <div
                        className="w-full max-w-[40px] bg-primary/20 group-hover:bg-primary/40 rounded-t-lg transition-all duration-300 relative overflow-hidden"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div
                          className="w-full bg-primary rounded-t-lg transition-all"
                          style={{ height: `${Math.min(100, heightPercent * 0.8)}%` }}
                        />
                      </div>

                      {/* Day Label */}
                      <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>0 lecturas</span>
                <span className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-primary inline-block" /> Lecturas
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-primary/20 inline-block" /> Interacciones
                  </span>
                </span>
                <span>{maxReads} máx</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Artículos con Más Lecturas del Círculo (Ranking Editorial) */}
        <Card className="shadow-sm">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <CardTitle className="font-serif text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Manuscritos con Mayor Audiencia
            </CardTitle>
            <CardDescription className="text-xs">
              Artículos destacados del círculo ordenados por volumen de lectores e impacto comunitario.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground">
                    <th className="py-2.5 font-medium">Manuscrito</th>
                    <th className="py-2.5 font-medium">Autor</th>
                    <th className="py-2.5 font-medium text-center">Lecturas</th>
                    <th className="py-2.5 font-medium text-center">Comentarios</th>
                    <th className="py-2.5 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {topReadArticles.map((art, idx) => (
                    <tr key={art.slug} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary w-4">
                            #{idx + 1}
                          </span>
                          <span className="font-serif font-bold text-foreground line-clamp-1">
                            {art.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground whitespace-nowrap">
                        {art.author}
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-primary">
                        {art.reads}
                      </td>
                      <td className="py-3 text-center font-mono text-muted-foreground">
                        {art.comments}
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <Link href={`/circulo/${params.slug}/articulos/${art.slug}`}>
                          <Button size="sm" variant="ghost" className="min-h-[36px] text-xs gap-1">
                            <Eye className="w-3.5 h-3.5" /> Leer
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 4. Cola de Manuscritos & Borradores Registrados */}
        <Card className="shadow-sm">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <CardTitle className="font-serif text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Cola de Manuscritos y Textos Registrados
            </CardTitle>
            <CardDescription className="text-xs">
              Administración de textos del círculo con edición directa en TipTap.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="divide-y divide-border/40">
              {circleArticles.map((item) => (
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
                      Autor: {item.authorName} • {item.readingTimeMin} min • {item.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link href={`/editor/${item.slug}`}>
                      <Button
                        variant="outline"
                        className="min-h-[44px] text-xs gap-1.5 font-medium px-3"
                      >
                        <Edit className="w-4 h-4 text-primary" /> Editar en TipTap
                      </Button>
                    </Link>
                    <Link href={`/circulo/${params.slug}/articulos/${item.slug}`}>
                      <Button
                        variant="ghost"
                        className="min-h-[44px] text-xs gap-1.5 font-medium px-3"
                      >
                        <Eye className="w-4 h-4" /> Ver
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
