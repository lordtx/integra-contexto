'use client';

export default function OverlayLeaderboard({ entries }: { entries: any[] }) {
  if (!entries?.length) {
    return <p className="text-slate-500 text-center py-12">Aguardando palpites...</p>;
  }
  return (
    <div className="space-y-1">
      {entries.map((e: any, i: number) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
        const colors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
        return (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm animate-slideIn"
            style={{
              animationDelay: `${i * 50}ms`,
              borderColor: i < 3 ? `${['#fbbf24', '#94a3b8', '#d97706'][i]}40` : undefined,
            }}
          >
            <span className={`w-8 text-center font-bold text-lg ${i < 3 ? colors[i] : 'text-slate-500'}`}>
              {medal || `#${e.rank || i + 1}`}
            </span>
            <span className="flex-1 font-medium text-white text-base">{e.word || '---'}</span>
            <span className="text-sm text-slate-400">@{e.username || '---'}</span>
            <span className={`text-sm font-mono w-16 text-right ${i < 3 ? colors[i] : 'text-indigo-400'}`}>
              {e.score?.toFixed(4)}
            </span>
          </div>
        );
      })}
    </div>
  );
}