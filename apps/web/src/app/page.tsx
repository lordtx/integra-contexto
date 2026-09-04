import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo / Titulo */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Integra Contexto
          </h1>
          <p className="text-lg text-slate-400">
            Jogo de palavras em tempo real para sua LIVE
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-3 text-left">
          {[
            { icon: '🎙️', title: 'Chat da LIVE', desc: 'Espectadores enviam palavras no chat' },
            { icon: '🧠', title: 'Semântica', desc: 'Ranking por proximidade de significado' },
            { icon: '⚡', title: 'Tempo Real', desc: 'Leaderboard atualizado instantaneamente' },
            { icon: '🎯', title: 'Overlay OBS', desc: 'Transparente, pronto para transmissão' },
          ].map((f, i) => (
            <div key={i} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 flex items-start gap-4 hover:border-indigo-500/30 transition-colors">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 text-center"
          >
            Dashboard
          </Link>
          <Link
            href="/overlay/demo"
            className="px-8 py-3 bg-[#1a1a2e] hover:bg-[#1e1e3e] text-slate-300 font-medium rounded-xl border border-[#1e1e2e] transition-all duration-200 text-center"
          >
            Overlay
          </Link>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-slate-700 pt-4">
          Integra Contexto v0.1.0 — Self-hosted · Open Source
        </p>
      </div>
    </div>
  );
}