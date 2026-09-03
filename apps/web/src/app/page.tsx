'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-6xl font-bold gradient-text">Integra Contexto</h1>
        <p className="text-lg text-slate-400">Jogo semântico multiplayer onde o chat da sua LIVE é o teclado do jogo.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="card space-y-2">
            <div className="text-indigo-400 text-2xl">🎮</div>
            <h3 className="font-semibold">Multi-plataforma</h3>
            <p className="text-sm text-slate-500">Conecte sua LIVE e os espectadores jogam pelo chat em tempo real.</p>
          </div>
          <div className="card space-y-2">
            <div className="text-purple-400 text-2xl">⚡</div>
            <h3 className="font-semibold">Tempo real</h3>
            <p className="text-sm text-slate-500">Ranking atualizado instantaneamente via WebSocket.</p>
          </div>
          <div className="card space-y-2">
            <div className="text-pink-400 text-2xl">🎯</div>
            <h3 className="font-semibold">Jogos customizáveis</h3>
            <p className="text-sm text-slate-500">Você define a palavra secreta e as regras da partida.</p>
          </div>
        </div>
        <Link href="/dashboard" className="btn-primary inline-block text-lg px-8 py-3">
          Ir para Dashboard
        </Link>
      </div>
    </main>
  );
}