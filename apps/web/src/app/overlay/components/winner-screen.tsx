'use client';

export default function WinnerScreen({ word, username, onDismiss }: { word: string; username: string; onDismiss: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onDismiss}
    >
      {/* Confetti CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#22d3ee'][i % 5],
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animation: `confetti-fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
      <div className="relative text-center space-y-6 p-12 animate-scaleIn">
        <div className="text-6xl">🎉</div>
        <h2 className="text-4xl font-bold gradient-text">Palavra Descoberta!</h2>
        <div className="text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]">
          {word}
        </div>
        <p className="text-xl text-slate-300">
          🏆 <span className="font-bold text-indigo-400">@{username}</span>
        </p>
        <style jsx>{`
          @keyframes confetti-fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </div>
    </div>
  );
}