import Link from 'next/link';
import { ArrowLeft, Edit, Eye, Plus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EditorPageProps {
  params: {
    slug: string;
  };
}

export default function CircleEditorPage({ params }: EditorPageProps) {
  const circleName = params.slug === 'ensayo-medico'
    ? 'Ensayo Médico'
    : params.slug === 'cronica'
    ? 'Crónica'
    : 'Reseña Literaria';

  const manuscripts = [
    {
      id: '1',
      title: 'El peso de la palabra no dicha: Apuntes sobre la anamnesis en urgencias',
      author: 'Dr. Julián Sotomayor',
      status: 'published',
      date: '01/09/2026',
      readingTime: '7 min',
    },
    {
      id: '2',
      title: 'Borrador: La anatomía del error médico y el tabú hospitalario',
      author: 'Dr. Julián Sotomayor',
      status: 'draft',
      date: '31/08/2026',
      readingTime: '5 min',
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <Link
            href={`/circulo/${params.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a la vista pública del círculo
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold">Mesa Editorial: {circleName}</h1>
            <Badge className="bg-amber-600 hover:bg-amber-700 text-white gap-1 text-xs">
              <Shield className="w-3 h-3" /> Modo Editor
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Gestión de manuscritos, revisión de borradores y control de publicaciones.
          </p>
        </div>

        <Button size="sm" className="gap-1.5 text-xs self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" /> Redactar Nuevo Manuscrito
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Artículos Publicados</CardDescription>
            <CardTitle className="text-2xl font-serif">1</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-[11px] text-muted-foreground">Visibles a todos los lectores</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Borradores en Revisión</CardDescription>
            <CardTitle className="text-2xl font-serif text-amber-500">1</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-[11px] text-muted-foreground">Privado solo para autores y editores</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Membresías del Círculo</CardDescription>
            <CardTitle className="text-2xl font-serif">42</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-[11px] text-muted-foreground">Lectores suscritos</span>
          </CardContent>
        </Card>
      </div>

      {/* Manuscripts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Cola de Manuscritos</CardTitle>
          <CardDescription className="text-xs">
            Listado completo de textos registrados en la base de datos PostgreSQL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/40">
            {manuscripts.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-medium text-sm text-foreground">{item.title}</span>
                    {item.status === 'published' ? (
                      <Badge variant="default" className="text-[10px] bg-emerald-600 hover:bg-emerald-700">
                        Publicado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Borrador
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Autor: {item.author} • {item.readingTime} • Creado el {item.date}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                    <Edit className="w-3 h-3" /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                    <Eye className="w-3 h-3" /> Vista Previa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
