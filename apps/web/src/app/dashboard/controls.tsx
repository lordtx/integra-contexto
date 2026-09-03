'use client';

export default function GameControls({ game, loading, onAction }: any) {
  const buttons = [
    { label: 'Nova Rodada', action: 'create', status: 'always', style: 'btn-primary w-full mb-2' },
    { label: '▶ Iniciar', action: 'start', showWhen: ['draft', 'ready'], style: 'btn-success' },
    { label: '⏸ Pausar', action: 'pause', showWhen: ['active'], style: 'btn-warning' },
    { label: '▶ Retomar', action: 'resume', showWhen: ['paused'], style: 'btn-success' },
    { label: '⏹ Finalizar', action: 'finish', showWhen: ['active', 'paused'], style: 'btn-danger' },
    { label: '💡 Dica', action: 'hint', showWhen: ['active'], style: 'btn-primary' },
  ];
  const status = game?.status || 'draft';
  return (
    <div className="card space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-slate-500">Controles</h2>
      <div className="space-y-2">
        {buttons.map(b => {
          const show = b.action === 'create' || (b.showWhen || []).includes(status);
          if (!show && b.action !== 'create') return null;
          return (
            <button
              key={b.action}
              onClick={() => onAction(b.action)}
              disabled={loading}
              className={b.style + (loading ? ' animate-pulse' : '')}
            >
              {loading ? '...' : b.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}