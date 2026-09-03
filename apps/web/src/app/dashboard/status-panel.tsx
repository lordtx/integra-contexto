'use client';

export default function StatusPanel({ game, status, stats }: any) {
  const statusColor: Record<string, string> = {
    draft: 'text-slate-500', ready: 'text-blue-400',
    active: 'text-emerald-400', paused: 'text-amber-400', finished: 'text-violet-400',
  };
  return (
    <div className="card space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-slate-500">Status</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-slate-400">TikTok</span><span className="text-emerald-400 flex items-center gap-1"><span className="live-dot w-2 h-2 bg-emerald-400 rounded-full inline-block" /> Conectado</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Live</span><span className={`${game?.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}>{game?.status === 'active' ? 'Ativa' : 'Inativa'}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Jogo</span><span className={statusColor[game?.status || 'draft']}>{game?.status || '---'}</span></div>
        <div className="border-t border-[#1e1e2e] pt-3 space-y-2">
          <div className="flex justify-between"><span className="text-slate-400">Jogadores</span><span className="font-mono">{stats.players}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Tentativas</span><span className="font-mono">{stats.attempts}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Melhor</span><span className="font-mono text-amber-400">#{stats.bestRank || '---'}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Tempo</span><span className="font-mono">{stats.elapsed}</span></div>
        </div>
      </div>
    </div>
  );
}