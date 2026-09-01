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

  // 1. RBAC: Mesa Editorial del Círculo (/circulo/[slug]/editor/*) -> Requiere rol 'editor'
  if (pathname.includes('/circulo/') && pathname.includes('/editor')) {
    const isEditor = currentRole === 'editor';
    if (!isEditor) {
      const forbiddenUrl = new URL('/403', request.url);
      forbiddenUrl.searchParams.set('reason', 'unauthorized_circle_editor');
      return NextResponse.rewrite(forbiddenUrl, { status: 403 });
    }
  }

  // 2. RBAC: Redacción y Edición de Artículos (/editor/*) -> Permitido para 'author' y 'editor'
  if (pathname.startsWith('/editor')) {
    const canWrite = currentRole === 'author' || currentRole === 'editor';
    if (!canWrite) {
      const forbiddenUrl = new URL('/403', request.url);
      forbiddenUrl.searchParams.set('reason', 'unauthorized_author_access');
      return NextResponse.rewrite(forbiddenUrl, { status: 403 });
    }
  }

  // 3. RBAC: Panel de Autor y Disponibilidad (/dashboard/autor/*) -> Permitido para 'author' y 'editor'
  if (pathname.startsWith('/dashboard/autor')) {
    const isAuthorOrEditor = currentRole === 'author' || currentRole === 'editor';
    if (!isAuthorOrEditor) {
      const forbiddenUrl = new URL('/403', request.url);
      forbiddenUrl.searchParams.set('reason', 'unauthorized_author_dashboard');
      return NextResponse.rewrite(forbiddenUrl, { status: 403 });
    }
  }

  return response;
}
