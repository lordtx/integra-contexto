import Link from 'next/link';

export default function OverlayPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Overlay de Jogo</h1>
        <p className="mb-4">
          Selecione um jogo para exibir o overlay:
        </p>
        <div className="space-y-2">
          {/* Lista de jogos será populada dinamicamente */}
          <Link
            href="/overlay/demo"
            className="block px-4 py-2 bg-primary-500 rounded hover:bg-primary-600 transition-colors text-center"
          >
            Jogo Demo
          </Link>
        </div>
      </div>
    </div>
  );
}