'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OverlayLeaderboard } from '../components/leaderboard';
import { WinnerScreen } from '../components/winner-screen';

interface GameData {
  id: string;
  status: string;
  currentWord: string;
  hints: string[];
  round: number;
  maxRounds: number;
}

export default function GameOverlayPage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const [game, setGame] = useState<GameData | null>(null);

  useEffect(() => {
    const mockGame: GameData = {
      id: gameId,
      status: 'active',
      currentWord: '_____',
      hints: ['Dica: Categoria: Animais', 'Dica: _ _ _ _ _'],
      round: 1,
      maxRounds: 10,
    };
    setGame(mockGame);
  }, [gameId]);

  if (!game) {
    return <div className="text-white text-center py-20">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8">
      <div className="bg-black/70 backdrop-blur-md rounded-xl p-8 text-white w-full max-w-2xl border border-white/10">
        <div className="text-center mb-8">
          <div className="text-sm text-white/50 mb-2 font-mono">
            Rodada {game.round}/{game.maxRounds}
          </div>
          <div className="text-5xl font-bold tracking-[0.2em] mb-4 font-mono">
            {game.currentWord}
          </div>
          <div className="space-y-1">
            {game.hints.map((hint, i) => (
              <div key={i} className="text-lg text-white/70 font-mono">{hint}</div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <OverlayLeaderboard />
          <WinnerScreen />
        </div>

        <div className="text-center mt-6 text-xs text-white/30 font-mono">
          Integra Contexto · @arthvision
        </div>
      </div>
    </div>
  );
}