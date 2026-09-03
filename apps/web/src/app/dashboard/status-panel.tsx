'use client';

interface StatusPanelProps {
  streamActive: boolean;
}

export function StatusPanel({ streamActive }: StatusPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Status</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              streamActive ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <span>Stream: {streamActive ? 'Ativa' : 'Inativa'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span>Jogadores: 0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span>Rodada: -</span>
        </div>
      </div>
    </div>
  );
}