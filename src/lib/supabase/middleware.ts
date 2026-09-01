import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database.types';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Simulación de rol mediante cookie o metadata para entorno demo/local sin Supabase activo
  const demoRole = request.cookies.get('anamnesis_demo_role')?.value;
  const currentRole = demoRole || user?.user_metadata?.role || 'reader';

  const pathname = request.nextUrl.pathname;

  // RBAC: Protección estricta de rutas de edición de círculos (/circulo/[slug]/editor/*)
  if (pathname.includes('/editor')) {
    const isEditor = currentRole === 'editor';
    if (!isEditor) {
      // Redirigir a 403 estilizado sin filtrar metadata del círculo
      const forbiddenUrl = new URL('/403', request.url);
      forbiddenUrl.searchParams.set('reason', 'unauthorized_editor_access');
      return NextResponse.rewrite(forbiddenUrl, { status: 403 });
    }
  }

  return response;
}
