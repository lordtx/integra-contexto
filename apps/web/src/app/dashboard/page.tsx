'use client';

import { useState } from 'react';
import { StatusPanel } from './status-panel';
import { Controls } from './controls';
import { Leaderboard } from './leaderboard';
import { RecentGuesses } from './recent-guesses';

export default function DashboardPage() {
  const [streamActive, setStreamActive] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      {/* Header */}
      <header className="border-b border-dark-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-tik-indigo via-tik-purple to-tik-pink bg-clip-text text-transparent">
              Integra Contexto
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                streamActive
                  ? 'bg-green-900/40 text-green-400 border border-green-700/50'
                  : 'bg-zinc-800/40 text-zinc-400 border border-zinc-700/50'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  streamActive ? 'bg-green-400 animate-pulse' : 'bg-zinc-500'
                }`}
              />
              {streamActive ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
          <button className="px-5 py-2 bg-gradient-to-r from-tik-indigo to-tik-purple text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-tik-indigo/20">
            Conectar TikTok
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column — Status + Controls */}
          <div className="lg:col-span-4 space-y-6">
            <StatusPanel streamActive={streamActive} />
            <Controls
              streamActive={streamActive}
              onToggleStream={() => setStreamActive(!streamActive)}
            />
          </div>

          {/* Right Column — Leaderboard + Recent Guesses */}
          <div className="lg:col-span-8 space-y-6">
            <Leaderboard />
            <RecentGuesses />
          </div>
        </div>
      </main>
    </div>
  );
}