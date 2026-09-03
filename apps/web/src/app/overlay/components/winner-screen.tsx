'use client';

export function WinnerScreen() {
  return (
    <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-2">Vencedor</h3>
      <div className="text-4xl mb-2">🏆</div>
      <p className="text-xl font-bold text-yellow-400">Aguardando...</p>
      <p className="text-sm text-gray-400 mt-1">
        O vencedor aparecerá aqui ao final do jogo
      </p>
    </div>
  );
}