'use client';

interface ControlsProps {
  streamActive: boolean;
  onToggleStream: () => void;
}

export function Controls({ streamActive, onToggleStream }: ControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Controles</h2>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={onToggleStream}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            streamActive
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {streamActive ? 'Parar Stream' : 'Iniciar Stream'}
        </button>
        <button
          disabled={!streamActive}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Iniciar Jogo
        </button>
        <button
          disabled={!streamActive}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima Rodada
        </button>
      </div>
    </div>
  );
}