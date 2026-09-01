'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import {
  getCircleBySlug,
  getCircleMembers,
  getCircleInvitations,
  CircleMemberItem,
  CircleInvitationItem,
} from '@/lib/data/mock-db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';

export default function CircleMembersEditorPage() {
  const params = useParams();
  const slug = (params.slug as string) || 'cronica';
  const circle = getCircleBySlug(slug);

  const [members, setMembers] = React.useState<CircleMemberItem[]>([]);
  const [invitations, setInvitations] = React.useState<CircleInvitationItem[]>([]);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState<'member' | 'moderator' | 'admin'>('moderator');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    setMembers(getCircleMembers(slug));
    setInvitations(getCircleInvitations(slug));
  }, [slug]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) {
      setFeedbackMessage({
        type: 'error',
        text: 'Por favor, ingresa un correo electrónico válido.',
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newInvitation: CircleInvitationItem = {
        id: `inv-${Date.now()}`,
        circleId: circle?.id || '2222',
        email: inviteEmail,
        role: inviteRole,
        invitedBy: circle?.editorId || 'cccc',
        invitedByName: circle?.editorName || 'Elena Rocafuerte',
        status: 'pending',
        createdAt: 'Hace un momento',
        expiresAt: 'En 7 días',
      };

      setInvitations((prev) => [newInvitation, ...prev]);
      setInviteEmail('');
      setIsSubmitting(false);
      setFeedbackMessage({
        type: 'success',
        text: `Invitación enviada exitosamente a ${inviteEmail} con rol de ${
          inviteRole === 'moderator'
            ? 'Autor Colaborador'
            : inviteRole === 'admin'
            ? 'Co-Editor'
            : 'Lector Miembro'
        }.`,
      });

      setTimeout(() => setFeedbackMessage(null), 5000);
    }, 600);
  };

  const handleRevokeAccess = (memberId: string, memberName: string) => {
    if (confirm(`¿Estás seguro de que deseas revocar el acceso y membresía a ${memberName}?`)) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      setFeedbackMessage({
        type: 'success',
        text: `Acceso revocado a ${memberName}. Los permisos fueron actualizados en la base de datos con políticas RLS.`,
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleCancelInvite = (invitationId: string, email: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
    setFeedbackMessage({
      type: 'success',
      text: `Invitación a ${email} cancelada correctamente.`,
    });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleRoleChange = (
    memberId: string,
    newRole: 'member' | 'moderator' | 'admin'
  ) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, circleRole: newRole } : m))
    );
    setFeedbackMessage({
      type: 'success',
      text: `Rol de miembro actualizado exitosamente a ${newRole}.`,
    });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-20">
      {/* Navigation Subheader */}
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="container mx-auto max-w-6xl px-3 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href={`/circulo/${slug}`}
            className="flex items-center gap-1.5 min-h-[44px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a la vista pública del círculo
          </Link>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-foreground">
              {circle?.name || 'Círculo'}
            </span>
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
                  Mesa Editorial: {circle?.name || 'Círculo'}
                </h1>
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white gap-1 text-[11px]">
                  <Shield className="w-3 h-3" /> Editor
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Control de acceso, invitaciones a nuevos autores y gobernanza de la comunidad con RLS.
              </p>
            </div>
          </div>

          {/* Editor Sub Tabs */}
          <div className="flex items-center gap-2 pt-2">
            <Link href={`/circulo/${slug}/editor`}>
              <Button
                variant="ghost"
                className="min-h-[44px] gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-4 h-4" />
                Cola de Manuscritos
              </Button>
            </Link>
            <Link href={`/circulo/${slug}/editor/members`}>
              <Button
                variant="secondary"
                className="min-h-[44px] gap-2 text-xs font-semibold bg-accent text-accent-foreground shadow-sm"
              >
                <Users className="w-4 h-4 text-primary" />
                Miembros & Autores ({members.length})
              </Button>
            </Link>
          </div>
        </div>

        {/* Feedback Alert if present */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-200 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-destructive/10 border-destructive/30 text-destructive'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium">{feedbackMessage.text}</div>
          </div>
        )}

        {/* Section 1: Invite New Author / Member Form */}
        <Card className="shadow-sm border-primary/20 bg-gradient-to-b from-card to-muted/10">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <CardTitle className="font-serif text-lg font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Invitar Autores o Colaboradores al Círculo
            </CardTitle>
            <CardDescription className="text-xs">
              Envía una invitación segura por correo electrónico. Las políticas RLS de PostgreSQL garantizan que solo el editor del círculo puede emitir tokens de membresía.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-2">
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-12 items-end">
                <div className="sm:col-span-6 space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Correo Electrónico del Autor
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="autor.invitado@anamnesis.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="pl-9 min-h-[44px] text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Rol en el Círculo
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) =>
                      setInviteRole(e.target.value as 'member' | 'moderator' | 'admin')
                    }
                    className="w-full min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="moderator">Autor / Moderador</option>
                    <option value="admin">Co-Editor / Admin</option>
                    <option value="member">Lector Suscriptor</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[44px] gap-2 text-xs font-medium bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="w-4 h-4" />
                    {isSubmitting ? 'Enviando...' : 'Emitir Invitación'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Section 2: Active Members List */}
        <Card className="shadow-sm">
          <CardHeader className="p-5 sm:p-6 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="font-serif text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Miembros Activos del Círculo
              </CardTitle>
              <CardDescription className="text-xs">
                Gestiona roles, eleva a moderadores de manuscritos o revoca membresías.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 min-h-[44px] text-xs"
              />
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="divide-y divide-border/40">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Member Info */}
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={member.userAvatar}
                      fallback={member.userName.substring(0, 2).toUpperCase()}
                      className="w-11 h-11 border border-border/60 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/autor/${member.userId}`}
                          className="font-serif font-bold text-sm text-foreground hover:text-primary hover:underline transition-colors"
                        >
                          {member.userName}
                        </Link>
                        {member.circleRole === 'admin' ? (
                          <Badge className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] px-2 py-0">
                            Editor / Admin
                          </Badge>
                        ) : member.circleRole === 'moderator' ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2 py-0">
                            Autor Moderador
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] px-2 py-0">
                            Lector Miembro
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.userEmail} • Miembro desde {member.joinedAt}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Role Switcher */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 self-end md:self-auto">
                    <select
                      value={member.circleRole}
                      onChange={(e) =>
                        handleRoleChange(
                          member.id,
                          e.target.value as 'member' | 'moderator' | 'admin'
                        )
                      }
                      className="min-h-[44px] rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="member">Lector Miembro</option>
                      <option value="moderator">Autor Moderador</option>
                      <option value="admin">Co-Editor / Admin</option>
                    </select>

                    <Button
                      variant="destructive"
                      onClick={() => handleRevokeAccess(member.id, member.userName)}
                      className="min-h-[44px] text-xs gap-1.5 font-medium px-3"
                      title="Revocar acceso y expulsar del círculo"
                    >
                      <UserMinus className="w-4 h-4" />
                      <span className="hidden sm:inline">Revocar Acceso</span>
                    </Button>
                  </div>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No se encontraron miembros con el criterio de búsqueda.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Pending Invitations Tray */}
        <Card className="shadow-sm">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <CardTitle className="font-serif text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> Invitaciones Pendientes ({invitations.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Invitaciones enviadas que aún no han sido aceptadas por los autores destinatarios.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-0">
            {invitations.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No hay invitaciones pendientes en este círculo.
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium text-foreground flex items-center gap-2">
                        <span>{inv.email}</span>
                        <Badge variant="outline" className="text-[10px]">
                          Rol propuesto: {inv.role}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Enviada por {inv.invitedByName} ({inv.createdAt}) • Expira {inv.expiresAt}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          alert(`Invitación reenviada a ${inv.email}`);
                        }}
                        className="min-h-[44px] text-xs gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Reenviar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelInvite(inv.id, inv.email)}
                        className="min-h-[44px] text-xs text-destructive hover:bg-destructive/10 gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Cancelar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
