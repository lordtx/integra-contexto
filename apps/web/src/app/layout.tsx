import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Integra Contexto',
  description: 'Jogo de palavras integrado com transmissões ao vivo — descubra a palavra secreta com a audiência!',
  openGraph: {
    title: 'Integra Contexto',
    description: 'Jogo de palavras integrado com transmissões ao vivo',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#0a0a0f] text-[#ededed] antialiased">
        {children}
      </body>
    </html>
  );
}