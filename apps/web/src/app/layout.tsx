import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Integra Contexto',
  description: 'Jogo de palavras integrado com transmissões ao vivo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}