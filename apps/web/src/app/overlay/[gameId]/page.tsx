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
    // Simula busca do jogo
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
    return <div className="text-white text-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8">
      <div className="bg-black/60 backdrop-blur-md rounded-xl p-8 text-white w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-400 mb-2">
            Rodada {game.round}/{game.maxRounds}
          </div>
          <div className="text-5xl font-bold tracking-wider mb-4 font-mono">
            {game.currentWord}
          </div>
          <div className="space-y-1">
            {game.hints.map((hint, i) => (
              <div key={i} className="text-lg text-gray-300">{hint}</div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <OverlayLeaderboard />
          <WinnerScreen />
        </div>
      </div>
    </div>
  );
}