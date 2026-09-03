'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OverlayPage() {
  const [gameId, setGameId] = useState('');
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card space-y-4 p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold gradient-text text-center">Overlay</h1>
        <p className="text-sm text-slate-400 text-center">Conecte ao jogo para exibir o overlay na live.</p>
        <input
          value={gameId}
          onChange={e => setGameId(e.target.value)}
          placeholder="ID do jogo"
          className="w-full bg-[#1a1a2e] border border-[#1e1e2e] rounded-lg px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => gameId && router.push(`/overlay/${gameId}`)}
          disabled={!gameId}
          className="btn-primary w-full"
        >
          Conectar
        </button>
      </div>
    </div>
  );
}