import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'Anamnesis | Plataforma Literaria y Ensayística',
  description: 'Espacio de confluencia entre la literatura, la crónica urbana y el ensayo clínico.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground bg-muted/20">
            <div className="container mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-serif tracking-wider font-semibold text-foreground">
                ANAMNESIS © {new Date().getFullYear()}
              </div>
              <div className="text-muted-foreground">
                Arquitectura Next.js 14+ • Supabase PostgreSQL • RBAC • Tailwind CSS • Shadcn UI
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
