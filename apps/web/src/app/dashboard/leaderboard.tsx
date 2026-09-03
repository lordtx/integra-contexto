'use client';

interface PlayerEntry {
  rank: number;
  username: string;
  score: number;
}

const mockPlayers: PlayerEntry[] = [
  { rank: 1, username: 'player1', score: 1200 },
  { rank: 2, username: 'player2', score: 950 },
  { rank: 3, username: 'player3', score: 780 },
];

export function Leaderboard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
      <div className="space-y-2">
        {mockPlayers.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum jogador ainda</p>
        ) : (
          mockPlayers.map((player) => (
            <div
              key={player.rank}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary-500">#{player.rank}</span>
                <span>{player.username}</span>
              </div>
              <span className="font-semibold">{player.score} pts</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}