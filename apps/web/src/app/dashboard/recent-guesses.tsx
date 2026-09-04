'use client';

import { useState, useEffect } from 'react';

interface GuessEntry {
  id: string;
  username: string;
  word: string;
  rank: number;
  score: number;
}

const mockGuesses: GuessEntry[] = [
  { id: '1', username: 'player5', word: 'janela', rank: 5, score: 310 },
  { id: '2', username: 'player4', word: 'camisa', rank: 4, score: 520 },
  { id: '3', username: 'player3', word: 'sistema', rank: 3, score: 780 },
  { id: '4', username: 'player2', word: 'cultura', rank: 2, score: 950 },
  { id: '5', username: 'player1', word: 'contexto', rank: 1, score: 1200 },
];

export function RecentGuesses() {
  const [guesses, setGuesses] = useState<GuessEntry[]>(mockGuesses);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate new guesses arriving with fade-in effect
    if (guesses.length > 0) {
      const timer = setTimeout(() => {
        setVisibleIds(new Set(guesses.map((g) => g.id)));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [guesses]);

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Últimas Tentativas
        </h2>
        <span className="text-xs text-zinc-500 font-mono">
          {guesses.length} tentativas
        </span>
      </div>

      {guesses.length === 0 ? (
        <p className="text-zinc-500 text-sm text-center py-8">
          Nenhuma tentativa ainda
        </p>
      ) : (
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {guesses.map((guess, index) => (
            <div
              key={guess.id}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl bg-dark-muted/30 border border-dark-border/40 hover:border-tik-indigo/20 transition-all ${
                visibleIds.has(guess.id) ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-tik-indigo/20 to-tik-purple/20 flex items-center justify-center text-xs font-mono font-bold text-tik-indigo shrink-0">
                  #{guess.rank}
                </span>
                <div className="min-w-0">
                  <span className="font-mono text-sm font-medium text-zinc-200">
                    {guess.word}
                  </span>
                  <span className="text-xs text-zinc-500 ml-2">
                    @{guess.username}
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-tik-purple/80 shrink-0 ml-3">
                +{guess.score}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Scroll hint */}
      {guesses.length > 4 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-zinc-600">↓ scroll para mais</span>
        </div>
      )}
    </div>
  );
}