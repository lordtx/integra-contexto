'use client';

interface PlayerEntry {
  rank: number;
  username: string;
  word: string;
  score: number;
}

const mockPlayers: PlayerEntry[] = [
  { rank: 1, username: 'player1', word: 'contexto', score: 1200 },
  { rank: 2, username: 'player2', word: 'cultura', score: 950 },
  { rank: 3, username: 'player3', word: 'sistema', score: 780 },
  { rank: 4, username: 'player4', word: 'camisa', score: 520 },
  { rank: 5, username: 'player5', word: 'janela', score: 310 },
];

const medals: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export function Leaderboard() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Leaderboard
        </h2>
        <span className="text-xs text-zinc-500 font-mono">
          {mockPlayers.length} jogadores
        </span>
      </div>

      {mockPlayers.length === 0 ? (
        <p className="text-zinc-500 text-sm text-center py-8">
          Nenhum jogador ainda
        </p>
      ) : (
        <div className="overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-zinc-500 uppercase tracking-wider font-medium">
            <span className="col-span-2">#</span>
            <span className="col-span-4">Palavra</span>
            <span className="col-span-3">Usuário</span>
            <span className="col-span-3 text-right">Score</span>
          </div>

          <div className="space-y-1">
            {mockPlayers.map((player, index) => (
              <div
                key={player.rank}
                className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-xl bg-dark-muted/40 hover:bg-dark-muted/80 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <span className="col-span-2 font-mono text-sm font-bold">
                  {player.rank <= 3 ? (
                    <span>{medals[player.rank]}</span>
                  ) : (
                    <span className="text-zinc-500">#{player.rank}</span>
                  )}
                </span>
                <span className="col-span-4 font-mono text-sm text-zinc-300">
                  {player.word}
                </span>
                <span className="col-span-3 text-sm text-zinc-400 truncate">
                  @{player.username}
                </span>
                <span className="col-span-3 text-sm font-mono font-semibold text-right text-tik-indigo">
                  {player.score.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}