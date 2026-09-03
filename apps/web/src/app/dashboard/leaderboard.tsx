'use client';

const medals = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ entries }: any) {
  if (!entries?.length) return (
    <div className="card">
      <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-3">Leaderboard</h2>
      <p className="text-slate-500 text-sm text-center py-8">Nenhum palpite ainda. Compartilhe a LIVE e veja as palavras aparecerem aqui.</p>
    </div>
  );
  return (
    <div className="card">
      <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-3">Leaderboard</h2>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {entries.map((e: any, i: number) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a2e] transition-colors">
            <span className="w-6 text-center font-mono text-sm text-slate-500">
              {i < 3 ? medals[i] : `#${e.rank || i + 1}`}
            </span>
            <span className="flex-1 font-medium text-sm text-white">{e.word || e.normalized || '---'}</span>
            <span className="text-xs text-slate-400 truncate">@{e.username || e.userId?.slice(0,8)}</span>
            <span className="text-xs font-mono text-indigo-400 w-12 text-right">{e.score?.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}