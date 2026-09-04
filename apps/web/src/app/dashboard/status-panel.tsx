'use client';

interface StatusPanelProps {
  streamActive: boolean;
}

export function StatusPanel({ streamActive }: StatusPanelProps) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
        Status da Sessão
      </h2>

      {/* Connection statuses */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">TikTok</span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Conectado
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Live</span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Ativa
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Jogo</span>
          <span className="text-sm font-mono font-medium text-yellow-400">
            ● Draft
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dark-border" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-muted rounded-xl p-3">
          <span className="text-xs text-zinc-500 block mb-0.5">Jogadores</span>
          <span className="text-lg font-bold font-mono text-white">0</span>
        </div>
        <div className="bg-dark-muted rounded-xl p-3">
          <span className="text-xs text-zinc-500 block mb-0.5">Tentativas</span>
          <span className="text-lg font-bold font-mono text-white">0</span>
        </div>
        <div className="bg-dark-muted rounded-xl p-3">
          <span className="text-xs text-zinc-500 block mb-0.5">Melhor Rank</span>
          <span className="text-lg font-bold font-mono text-white">—</span>
        </div>
        <div className="bg-dark-muted rounded-xl p-3">
          <span className="text-xs text-zinc-500 block mb-0.5">Tempo</span>
          <span className="text-lg font-bold font-mono text-white">00:00</span>
        </div>
      </div>

      {/* Secret word */}
      <div className="bg-dark-muted rounded-xl p-3 flex items-center justify-between">
        <span className="text-xs text-zinc-500">Palavra Secreta</span>
        <span className="font-mono text-lg tracking-[0.3em] text-zinc-600">••••</span>
      </div>
    </div>
  );
}