'use client';

export function OverlayLeaderboard() {
  const mockPlayers = [
    { name: 'Player1', score: 1200 },
    { name: 'Player2', score: 950 },
    { name: 'Player3', score: 780 },
  ];

  return (
    <div className="bg-white/10 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Leaderboard</h3>
      <div className="space-y-2">
        {mockPlayers.map((player, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-2 bg-white/5 rounded"
          >
            <span>
              <strong>{i + 1}.</strong> {player.name}
            </span>
            <span className="text-primary-300">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}