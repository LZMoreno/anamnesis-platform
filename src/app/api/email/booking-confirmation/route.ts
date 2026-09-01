import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { formatInTimezone, formatTimeRangeInZone } from '@/lib/calendar/ics-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookingId,
      startTime,
      endTime,
      readerName,
      readerEmail,
      readerTimezone,
      authorName,
      authorEmail,
      authorTimezone,
      articleTitle,
      notes,
    } = body;

    if (!readerEmail || !authorEmail || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios para enviar el correo.' },
        { status: 400 }
      );
    }

    const rTimezone = readerTimezone || 'America/Mexico_City';
    const aTimezone = authorTimezone || 'America/Bogota';

    // Rango horario en el huso local del lector
    const readerTimeRange = formatTimeRangeInZone(startTime, endTime, rTimezone);
    const readerDateStr = formatInTimezone(startTime, rTimezone, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Rango horario en el huso del autor
    const authorTimeRange = formatTimeRangeInZone(startTime, endTime, aTimezone);
    const authorDateStr = formatInTimezone(startTime, aTimezone, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Anamnesis <notificaciones@anamnesis.com>';

    // Plantilla HTML del Correo para el Lector
    const readerHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
        <div style="text-align: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 24px; color: #0284c7; margin: 0; font-weight: bold; letter-spacing: 1px;">ANAMNESIS</h1>
          <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0; text-transform: uppercase;">Confirmación de Sesión de Mentoría (30 Minutos)</p>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">Hola, <strong>${readerName}</strong>:</p>
        <p style="font-size: 15px; line-height: 1.6; color: #374151;">
          Tu sesión individual de 30 minutos con <strong>${authorName}</strong> ha sido confirmada con éxito.
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 18px; margin: 24px 0; border-radius: 6px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #0284c7;">Detalles de tu Cita (Tu Huso Horario Local):</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Fecha:</strong> ${readerDateStr}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Horario:</strong> ${readerTimeRange} (${rTimezone})</p>
          ${articleTitle ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Manuscrito:</strong> ${articleTitle}</p>` : ''}
          ${notes ? `<p style="margin: 4px 0; font-size: 13px; color: #6b7280; font-style: italic;"><strong>Tus notas:</strong> «${notes}»</p>` : ''}
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://anamnesis.com/sala-virtual/${bookingId}" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">
            Ingresar a la Sala Virtual
          </a>
        </div>

        <p style="font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 32px;">
          * Recuerda que puedes cancelar o reagendar hasta 2 horas antes de la sesión ingresando a tu sección de Agenda.
        </p>
      </div>
    `;

    // Plantilla HTML del Correo para el Autor
    const authorHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
        <div style="text-align: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 24px; color: #059669; margin: 0; font-weight: bold; letter-spacing: 1px;">ANAMNESIS</h1>
          <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0; text-transform: uppercase;">Nueva Sesión Agendada</p>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">Hola, <strong>${authorName}</strong>:</p>
        <p style="font-size: 15px; line-height: 1.6; color: #374151;">
          El lector <strong>${readerName}</strong> (${readerEmail}) ha reservado un bloque de 30 minutos de tu disponibilidad.
        </p>

        <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 18px; margin: 24px 0; border-radius: 6px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #059669;">Detalles en tu Horario Local:</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Fecha:</strong> ${authorDateStr}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Horario:</strong> ${authorTimeRange} (${aTimezone})</p>
          ${articleTitle ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Tema / Manuscrito:</strong> ${articleTitle}</p>` : ''}
          ${notes ? `<p style="margin: 4px 0; font-size: 13px; color: #4b5563; font-style: italic;"><strong>Preguntas del Lector:</strong> «${notes}»</p>` : ''}
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://anamnesis.com/dashboard/autor/disponibilidad" style="background-color: #059669; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">
            Ver en mi Panel "Mi Día"
          </a>
        </div>
      </div>
    `;

    // Si Resend API Key está configurada, enviamos vía Resend
    if (resendApiKey && resendApiKey.startsWith('re_') && resendApiKey !== 're_tu_resend_api_key_aqui') {
      const resend = new Resend(resendApiKey);

      // Enviar al Lector
      await resend.emails.send({
        from: fromEmail,
        to: readerEmail,
        subject: `Confirmación de Sesión con ${authorName} • Anamnesis`,
        html: readerHtml,
      });

      // Enviar al Autor
      await resend.emails.send({
        from: fromEmail,
        to: authorEmail,
        subject: `Nueva Mentoría Agendada: ${readerName} • Anamnesis`,
        html: authorHtml,
      });

      return NextResponse.json({
        success: true,
        sent: true,
        message: 'Correos transaccionales enviados exitosamente a lector y autor vía Resend.',
      });
    }

    // Modo Simulación en Desarrollo
    console.log('[RESEND SIMULATED] Correo de confirmación enviado a Lector:', readerEmail, `(${readerTimeRange} ${rTimezone})`);
    console.log('[RESEND SIMULATED] Correo de confirmación enviado a Autor:', authorEmail, `(${authorTimeRange} ${aTimezone})`);

    return NextResponse.json({
      success: true,
      simulated: true,
      message: 'Confirmación registrada (simulación de correo transaccional en servidor).',
    });
  } catch (error: any) {
    console.error('Error en /api/email/booking-confirmation:', error);
    return NextResponse.json(
      { success: false, error: 'Error enviando confirmación por correo.', details: error.message },
      { status: 500 }
    );
  }
}
