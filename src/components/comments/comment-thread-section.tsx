'use client';

import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CornerDownRight,
  Eye,
  EyeOff,
  Loader2,
  MessageSquare,
  Radio,
  Reply,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  User,
} from 'lucide-react';
import {
  CommentItem,
  getCommentsByArticleSlug,
  addCommentMock,
  toggleModerateCommentMock,
} from '@/lib/data/mock-db';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface CommentThreadSectionProps {
  articleSlug: string;
  articleTitle: string;
  authorEmail: string;
  circleSlug: string;
  userRole?: 'reader' | 'author' | 'editor';
}

export function CommentThreadSection({
  articleSlug,
  articleTitle,
  authorEmail,
  circleSlug,
  userRole = 'reader',
}: CommentThreadSectionProps) {
  const [comments, setComments] = React.useState<CommentItem[]>([]);
  const [mainCommentInput, setMainCommentInput] = React.useState('');
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [replyInput, setReplyInput] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [realtimeActive, setRealtimeActive] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Cargar comentarios
  const loadComments = () => {
    setComments(getCommentsByArticleSlug(articleSlug));
  };

  React.useEffect(() => {
    loadComments();
  }, [articleSlug]);

  // Simulación de Supabase Realtime Channel
  React.useEffect(() => {
    const channelName = `realtime:comments:${articleSlug}`;
    console.log(`[Supabase Realtime] Conectado al canal ${channelName}`);
    setRealtimeActive(true);

    return () => {
      console.log(`[Supabase Realtime] Desconectado del canal ${channelName}`);
    };
  }, [articleSlug]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. PUBLICAR COMENTARIO PRINCIPAL
  const handlePostMainComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainCommentInput.trim()) return;

    setIsSubmitting(true);

    const newComment = await addCommentMock(
      articleSlug,
      mainCommentInput.trim(),
      null,
      {
        id: 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
        name: 'Sofía Valenzuela',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: userRole,
      }
    );

    // Notificar al autor vía API de Resend
    fetch('/api/email/new-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleTitle,
        articleSlug,
        circleSlug,
        authorEmail,
        authorName: 'Autor del Manuscrito',
        commenterName: 'Sofía Valenzuela',
        commentContent: mainCommentInput.trim(),
      }),
    }).catch((e) => console.warn('Email notification error:', e));

    loadComments();
    setMainCommentInput('');
    setIsSubmitting(false);
    showToast('¡Comentario publicado en tiempo real y notificado al autor!');
  };

  // 2. PUBLICAR RESPUESTA ANIDADA (THREADED REPLY)
  const handlePostReply = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    setIsSubmitting(true);

    await addCommentMock(
      articleSlug,
      replyInput.trim(),
      parentId,
      {
        id: userRole === 'editor' ? 'cccccccc-3333-4333-c333-cccccccccccc' : 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
        name: userRole === 'editor' ? 'Elena Rocafuerte (Editora)' : 'Sofía Valenzuela',
        avatar:
          userRole === 'editor'
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: userRole,
      }
    );

    loadComments();
    setReplyingToId(null);
    setReplyInput('');
    setIsSubmitting(false);
    showToast('Respuesta publicada en el hilo de discusión.');
  };

  // 3. MODERACIÓN DEL EDITOR DEL CÍRCULO (is_hidden = true/false)
  const handleToggleModerate = async (commentId: string, currentHiddenState: boolean) => {
    const res = await toggleModerateCommentMock(commentId, !currentHiddenState);
    if (res.success) {
      loadComments();
      showToast(
        !currentHiddenState
          ? 'Comentario moderado y ocultado para la comunidad.'
          : 'Comentario restaurado y visible nuevamente.'
      );
    }
  };

  const isEditor = userRole === 'editor';

  return (
    <section className="pt-10 space-y-6">
      {/* Section Header with Realtime Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2.5 font-serif text-2xl font-bold text-foreground">
          <MessageSquare className="w-6 h-6 text-primary" />
          <span>Comentarios & Diálogo Clínico ({comments.length})</span>
        </div>

        <div className="flex items-center gap-2">
          {realtimeActive && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Realtime Activo</span>
            </div>
          )}

          {isEditor && (
            <Badge className="bg-primary/20 text-primary border-primary/40 text-[10px] gap-1">
              <Shield className="w-3 h-3" /> Modo Moderador (Editor)
            </Badge>
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Comment Input Box */}
      <form onSubmit={handlePostMainComment} className="space-y-3 rounded-2xl border bg-card p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border/40 text-xs text-muted-foreground">
          <Avatar
            src={
              isEditor
                ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
            }
            fallback="US"
            className="w-6 h-6 border"
          />
          <span>
            Publicando como:{' '}
            <strong className="text-foreground">
              {isEditor ? 'Elena Rocafuerte (Editora)' : 'Sofía Valenzuela (Lector)'}
            </strong>
          </span>
        </div>

        <textarea
          value={mainCommentInput}
          onChange={(e) => setMainCommentInput(e.target.value)}
          placeholder="Escribe una reflexión, duda metodológica o pregunta sobre la tesis del manuscrito..."
          rows={3}
          className="w-full bg-transparent text-xs sm:text-sm font-serif resize-none focus:outline-none placeholder:text-muted-foreground leading-relaxed"
          required
        />

        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Respeta las pautas comunitarias y el rigor bioético.
          </span>
          <Button
            type="submit"
            disabled={isSubmitting || !mainCommentInput.trim()}
            className="min-h-[44px] text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 px-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Publicando...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Publicar Reflexión
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Threaded Comments List */}
      <div className="space-y-4 pt-2">
        {comments.length === 0 ? (
          <div className="p-8 text-center border rounded-2xl bg-muted/20 text-xs text-muted-foreground space-y-1">
            <MessageSquare className="w-8 h-8 mx-auto opacity-50 mb-1" />
            <div className="font-serif font-bold text-sm text-foreground">Aún no hay comentarios</div>
            <p>Sé el primero en iniciar el diálogo clínico o literario sobre este ensayo.</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isHidden = comment.isHidden;

            return (
              <div
                key={comment.id}
                className={`rounded-2xl border p-4 sm:p-5 bg-card shadow-sm space-y-3 transition-all ${
                  isHidden ? 'border-amber-500/40 bg-amber-500/5' : ''
                }`}
              >
                {/* Comment Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={comment.userAvatar} fallback="US" className="w-8 h-8 border" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-foreground">{comment.userName}</span>
                        {comment.userRole === 'author' && (
                          <Badge className="text-[10px] py-0 px-1.5 bg-primary/10 text-primary border-primary/30">
                            Autor
                          </Badge>
                        )}
                        {comment.userRole === 'editor' && (
                          <Badge className="text-[10px] py-0 px-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">
                            Mesa Editorial
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{comment.createdAt}</span>
                    </div>
                  </div>

                  {/* Moderation Controls (For Circle Editors) */}
                  {isEditor && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleModerate(comment.id, comment.isHidden)}
                      className={`min-h-[36px] text-xs gap-1.5 h-8 px-2.5 ${
                        comment.isHidden
                          ? 'text-emerald-600 hover:bg-emerald-500/10'
                          : 'text-amber-600 hover:bg-amber-500/10'
                      }`}
                      title={comment.isHidden ? 'Restaurar comentario' : 'Ocultar comentario (Moderar)'}
                    >
                      {comment.isHidden ? (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Restaurar
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Moderar / Ocultar
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Comment Body / Hidden Moderation Notice */}
                {isHidden && !isEditor ? (
                  <div className="rounded-xl p-3 bg-muted/40 border border-border/60 text-xs italic text-muted-foreground flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Este comentario ha sido moderado y ocultado por la Mesa Editorial de este círculo.</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {isHidden && isEditor && (
                      <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Comentario Oculto para la comunidad (Vista de Editor)
                      </div>
                    )}
                    <p className="text-xs sm:text-sm font-serif text-foreground/90 leading-relaxed pl-1 sm:pl-10">
                      {comment.content}
                    </p>
                  </div>
                )}

                {/* Reply Trigger Button */}
                {!isHidden && (
                  <div className="flex justify-end pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                      className="min-h-[36px] text-xs gap-1 text-muted-foreground hover:text-foreground h-8"
                    >
                      <Reply className="w-3.5 h-3.5" /> Responder
                    </Button>
                  </div>
                )}

                {/* Inline Reply Form */}
                {replyingToId === comment.id && (
                  <form
                    onSubmit={(e) => handlePostReply(comment.id, e)}
                    className="ml-2 sm:ml-10 p-3 rounded-xl border border-primary/30 bg-muted/30 space-y-2.5 animate-in fade-in duration-150"
                  >
                    <div className="text-[11px] font-semibold text-primary flex items-center gap-1">
                      <CornerDownRight className="w-3.5 h-3.5" /> Respondiendo a {comment.userName}:
                    </div>
                    <textarea
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder="Escribe tu réplica o aporte a este hilo..."
                      rows={2}
                      className="w-full bg-background p-2.5 rounded-lg border border-input text-xs font-serif resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                      required
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingToId(null)}
                        className="min-h-[36px] text-xs h-8"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !replyInput.trim()}
                        className="min-h-[36px] text-xs font-semibold h-8 bg-primary hover:bg-primary/90"
                      >
                        Publicar Respuesta
                      </Button>
                    </div>
                  </form>
                )}

                {/* Nested Threaded Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-2 sm:ml-10 space-y-3 pt-2 border-t border-border/40">
                    {comment.replies.map((reply) => {
                      const replyHidden = reply.isHidden;

                      return (
                        <div
                          key={reply.id}
                          className={`rounded-xl border-l-2 border-primary/50 pl-3 sm:pl-4 py-2.5 bg-muted/20 space-y-2 ${
                            replyHidden ? 'border-l-amber-500 bg-amber-500/5' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Avatar src={reply.userAvatar} fallback="US" className="w-6 h-6 border" />
                              <span className="font-serif font-bold text-foreground">{reply.userName}</span>
                              {reply.userRole === 'author' && (
                                <Badge className="text-[9px] py-0 px-1 bg-primary/10 text-primary border-primary/30">
                                  Autor
                                </Badge>
                              )}
                              {reply.userRole === 'editor' && (
                                <Badge className="text-[9px] py-0 px-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">
                                  Editor
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground">{reply.createdAt}</span>
                              {isEditor && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleModerate(reply.id, reply.isHidden)}
                                  className="min-h-[32px] text-[10px] h-6 px-1.5 text-amber-600 hover:bg-amber-500/10"
                                >
                                  {reply.isHidden ? 'Restaurar' : 'Moderar'}
                                </Button>
                              )}
                            </div>
                          </div>

                          {replyHidden && !isEditor ? (
                            <div className="text-[11px] italic text-muted-foreground">
                              [Respuesta oculta por moderación]
                            </div>
                          ) : (
                            <p className="text-xs font-serif text-foreground/90 leading-relaxed pl-8">
                              {reply.content}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
