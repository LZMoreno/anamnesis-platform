import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export interface AISuggestionResponse {
  success: boolean;
  data?: {
    titles: string[];
    excerpt: string;
    tags: string[];
  };
  error?: string;
  message?: string;
  isFallback?: boolean;
}

// Fallback editorial de alta calidad cuando la API Key no está configurada o el servicio no está disponible
function generateEditorialFallback(content: string, currentTitle?: string): {
  titles: string[];
  excerpt: string;
  tags: string[];
} {
  const cleanSnippet = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const firstWords = cleanSnippet.split(' ').slice(0, 30).join(' ');

  return {
    titles: [
      currentTitle || 'La cartografía del síntoma: Apuntes sobre la memoria clínica',
      'El silencio en la sala de urgencias: Fenomenología del cuerpo que habla',
      'La anamnesis como puente: Voces, diagnósticos y escucha hospitalaria',
    ],
    excerpt:
      firstWords.length > 50
        ? `${firstWords}... Una indagación crítica sobre la escucha y la palabra en el acto médico.`
        : 'Un ensayo reflexivo sobre las narrativas del cuidado, el diálogo clínico y el humanismo editorial.',
    tags: ['Medicina Narrativa', 'Bioética', 'Fenomenología', 'Humanismo'],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, currentTitle, circleSlug } = body;

    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      return NextResponse.json<AISuggestionResponse>(
        {
          success: false,
          error: 'INVALID_CONTENT',
          message: 'El contenido del manuscrito es demasiado breve para generar sugerencias editoriales.',
        },
        { status: 400 }
      );
    }

    // Extraer texto plano eliminando tags HTML para el prompt de Gemini
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // REGLA DURA: GEMINI_API_KEY vive exclusivamente en el servidor (nunca en el cliente)
    const apiKey = process.env.GEMINI_API_KEY;

    // Control de Errores & Degradación Elegante si la API key no está configurada o es de prueba
    if (!apiKey || apiKey === 'tu-google-gemini-api-key-aqui' || apiKey.trim().length < 5) {
      const fallback = generateEditorialFallback(plainText, currentTitle);
      return NextResponse.json<AISuggestionResponse>({
        success: true,
        isFallback: true,
        message: 'Servicio de IA no disponible temporalmente (utilizando sugerencias editoriales locales).',
        data: fallback,
      });
    }

    // Inicializar Google Gemini API SDK (@google/genai)
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Eres un editor y ensayista literario de alto nivel de la plataforma Anamnesis.
Analiza el siguiente texto de ensayo/crónica y devuelve UN OBJETO JSON ESTRICTO (sin markdown adicional) con esta estructura exacta:
{
  "titles": ["Título 1", "Título 2", "Título 3"],
  "excerpt": "Un resumen o bajada editorial de exactamente 2 oraciones en prosa profunda y elegante en español.",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
}
Requisitos de los títulos:
1. Deben ser sugerentes, poéticos y rigurosos (ej. "La sintaxis del dolor", "El peso de la palabra no dicha").
2. No uses fórmulas clickbait.
3. Las 4 etiquetas deben ser temas concisos en español (ej. Medicina Narrativa, Bioética, Crónica Urbana, Memoria).`;

    const prompt = `Título actual: ${currentTitle || 'Sin título'}
Círculo editorial: ${circleSlug || 'Ensayo'}
Contenido del manuscrito:
${plainText.slice(0, 4000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = response.text || '';
    let parsedData: any;

    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.warn('Error parseando JSON de Gemini, aplicando sanitización regex', parseError);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON returned by Gemini API');
      }
    }

    return NextResponse.json<AISuggestionResponse>({
      success: true,
      isFallback: false,
      data: {
        titles: Array.isArray(parsedData.titles) && parsedData.titles.length >= 3
          ? parsedData.titles.slice(0, 3)
          : [
              'La memoria del síntoma: Apuntes sobre la conversación clínica',
              'El silencio en la guardia: Fenomenología de la escucha',
              'La anamnesis como puente: Voces y diagnósticos',
            ],
        excerpt:
          typeof parsedData.excerpt === 'string' && parsedData.excerpt.length > 20
            ? parsedData.excerpt
            : 'Una indagación crítica sobre la escucha y la palabra en el acto médico.',
        tags:
          Array.isArray(parsedData.tags) && parsedData.tags.length >= 4
            ? parsedData.tags.slice(0, 4)
            : ['Medicina Narrativa', 'Bioética', 'Fenomenología', 'Humanismo'],
      },
    });
  } catch (error: any) {
    console.error('Error en /api/ai/suggest (Graceful degradation activa):', error);

    // Degradación elegante: retornamos fallback editorial con status 200 para no bloquear al usuario
    const fallback = generateEditorialFallback('Contenido editorial', 'Ensayo Clínico');
    return NextResponse.json<AISuggestionResponse>({
      success: true,
      isFallback: true,
      error: 'GEMINI_SERVICE_UNAVAILABLE',
      message: 'Servicio de IA no disponible temporalmente (se activó el modo de sugerencia editorial segura).',
      data: fallback,
    });
  }
}
