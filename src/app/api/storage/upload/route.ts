import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'articles';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se ha adjuntado ningún archivo para subir.' },
        { status: 400 }
      );
    }

    // 1. Validación de Tipo MIME
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Tipo de archivo no permitido (${file.type}). Formatos aceptados: JPG, PNG, WebP, GIF, AVIF.`,
        },
        { status: 400 }
      );
    }

    // 2. Validación de Tamaño Máximo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `El archivo supera el límite máximo permitido de 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
        },
        { status: 400 }
      );
    }

    // 3. Generación de Nombre Seguro
    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const cleanFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
    const filePath = `uploads/${cleanFileName}`;

    // 4. Conexión Segura con Supabase Storage en Servidor
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      supabaseUrl &&
      serviceRoleKey &&
      !supabaseUrl.includes('mock-supabase') &&
      serviceRoleKey !== 'tu-service-role-key-aqui'
    ) {
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return NextResponse.json({
        success: true,
        url: publicUrlData.publicUrl,
        key: filePath,
        size: file.size,
        mimeType: file.type,
      });
    }

    // Modo Demostración Local / Fallback Seguro (Crea Data URL para visualización inmediata)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      simulated: true,
      url: base64Data,
      key: filePath,
      size: file.size,
      mimeType: file.type,
      message: 'Imagen procesada exitosamente en servidor.',
    });
  } catch (error: any) {
    console.error('Error en /api/storage/upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al subir la imagen al almacenamiento seguro.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
