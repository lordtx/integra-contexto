'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Leaderboard from '../components/leaderboard';
import WinnerScreen from '../components/winner-screen';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';

export default function OverlayGamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [lastGuess, setLastGuess] = useState<any>(null);
  const [winner, setWinner] = useState<{ word: string; username: string } | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    if (!gameId) return;
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => { ws.send(JSON.stringify({ type: 'subscribe', gameId })); setConnected(true); };
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === 'leaderboard.updated') setLeaderboard(data.data?.leaderboard || []);
        if (data.event === 'guess.created') setLastGuess(data);
        if (data.event === 'game.finished') setWinner({ word: data.data?.secretWord || '', username: data.data?.winner || '' });
      } catch {}
    };
    ws.onclose = () => { setConnected(false); setTimeout(connect, 3000); };
    ws.onerror = () => ws.close();
    return () => ws.close();
  }, [gameId]);

  useEffect(() => { const cleanup = connect(); return () => cleanup?.(); }, [connect]);

  return (
    <div className="min-h-screen bg-transparent p-6">
      {winner && <WinnerScreen word={winner.word} username={winner.username} onDismiss={() => setWinner(null)} />}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold gradient-text">Integra Contexto</h1>
          <span className={`text-xs ${connected ? 'text-emerald-400' : 'text-red-400'}`}>{connected ? '● LIVE' : '○ Reconectando...'}</span>
        </div>
        <Leaderboard entries={leaderboard} />
        {lastGuess && (
          <div className="animate-fadeIn p-3 rounded-lg bg-white/5 border border-[#1e1e2e] flex items-center gap-3 backdrop-blur-sm">
            <span className="text-indigo-400 font-bold text-lg">{lastGuess.word || lastGuess.normalizedWord}</span>
            <span className="text-slate-400">@{lastGuess.username || lastGuess.userId?.slice(0, 8)}</span>
            <span className="ml-auto text-sm text-slate-500">#{lastGuess.rank || '-'}</span>
          </div>
        )}
      </div>
    </div>
  );
}