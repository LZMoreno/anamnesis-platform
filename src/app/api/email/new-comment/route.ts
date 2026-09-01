import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      articleTitle,
      articleSlug,
      circleSlug,
      authorEmail,
      authorName,
      commenterName,
      commentContent,
    } = body;

    if (!authorEmail || !commentContent || !articleTitle) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros para la notificación de comentario.' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Anamnesis <notificaciones@anamnesis.com>';

    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
        <div style="text-align: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 24px; color: #7c3aed; margin: 0; font-weight: bold; letter-spacing: 1px;">ANAMNESIS</h1>
          <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0; text-transform: uppercase;">Nuevo Diálogo en tu Manuscrito</p>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">Estimado/a <strong>${authorName || 'Autor'}</strong>:</p>
        <p style="font-size: 15px; line-height: 1.6; color: #374151;">
          <strong>${commenterName || 'Un lector'}</strong> ha dejado una nueva reflexión o pregunta en tu obra:
        </p>

        <div style="background-color: #f5f3ff; border-left: 4px solid #7c3aed; padding: 18px; margin: 24px 0; border-radius: 6px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #4c1d95;">«${articleTitle}»</h3>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; font-style: italic; color: #374151;">
            «${commentContent}»
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://anamnesis.com/circulo/${circleSlug || 'cronica'}/articulos/${articleSlug}" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">
            Responder al Comentario
          </a>
        </div>
      </div>
    `;

    if (resendApiKey && resendApiKey.startsWith('re_') && resendApiKey !== 're_tu_resend_api_key_aqui') {
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: fromEmail,
        to: authorEmail,
        subject: `Nuevo Comentario de ${commenterName} en "${articleTitle}" • Anamnesis`,
        html: emailHtml,
      });

      return NextResponse.json({
        success: true,
        sent: true,
        message: 'Notificación de comentario enviada al autor vía Resend.',
      });
    }

    console.log('[RESEND SIMULATED] Notificación de comentario enviada a Autor:', authorEmail, `por: ${commenterName}`);

    return NextResponse.json({
      success: true,
      simulated: true,
      message: 'Notificación registrada (simulación en servidor).',
    });
  } catch (error: any) {
    console.error('Error en /api/email/new-comment:', error);
    return NextResponse.json(
      { success: false, error: 'Error enviando notificación de comentario.', details: error.message },
      { status: 500 }
    );
  }
}
