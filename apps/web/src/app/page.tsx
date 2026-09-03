import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <h1 className="text-4xl font-bold text-primary-600">
        Integra Contexto
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-md">
        Jogo de adivinhação de palavras integrado com transmissões ao vivo.
        Conecte sua live, jogue com a audiência e divirta-se!
      </p>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/overlay"
          className="px-6 py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
        >
          Overlay
        </Link>
      </div>
    </div>
  );
}