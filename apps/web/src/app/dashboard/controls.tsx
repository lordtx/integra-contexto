'use client';

interface ControlsProps {
  streamActive: boolean;
  onToggleStream: () => void;
}

export function Controls({ streamActive, onToggleStream }: ControlsProps) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-5">
      {/* Nova Rodada — primary CTA */}
      <button
        disabled={!streamActive}
        className="w-full py-3.5 bg-gradient-to-r from-tik-indigo to-tik-purple text-white font-semibold text-sm rounded-xl hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-tik-indigo/20 flex items-center justify-center gap-2"
      >
        🎮 NOVA RODADA
      </button>

      {/* Action grid 2×2 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={!streamActive}
          className="py-3 bg-emerald-600/20 border border-emerald-700/40 text-emerald-400 font-medium text-sm rounded-xl hover:bg-emerald-600/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ▶ Iniciar
        </button>
        <button
          disabled={!streamActive}
          className="py-3 bg-amber-600/20 border border-amber-700/40 text-amber-400 font-medium text-sm rounded-xl hover:bg-amber-600/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ⏸ Pausar
        </button>
        <button
          disabled={!streamActive}
          className="py-3 bg-sky-600/20 border border-sky-700/40 text-sky-400 font-medium text-sm rounded-xl hover:bg-sky-600/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ▶ Retomar
        </button>
        <button
          disabled={!streamActive}
          className="py-3 bg-rose-600/20 border border-rose-700/40 text-rose-400 font-medium text-sm rounded-xl hover:bg-rose-600/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ■ Finalizar
        </button>
      </div>

      {/* Dica */}
      <button
        disabled={!streamActive}
        className="w-full py-3 bg-dark-muted border border-dark-border text-zinc-300 font-medium text-sm rounded-xl hover:bg-zinc-800/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        💡 Dica
      </button>
    </div>
  );
}