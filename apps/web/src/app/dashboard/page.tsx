"use client";
import { useState, useEffect, useCallback } from "react";
import StatusPanel from "./status-panel";
import GameControls from "./controls";
import Leaderboard from "./leaderboard";
import { useWebSocket } from "../hooks/useWebSocket";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const WS = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3002";

export default function DashboardPage() {
  const [game, setGame] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ players: 0, attempts: 0, bestRank: null, elapsed: "00:00" });
  const ws = useWebSocket(WS);
  const startTime = useState(Date.now());

  // Timer
  useEffect(() => {
    const t = setInterval(() => {
      if (game?.status === 'active') {
        const s = Math.floor((Date.now() - startTime[0]) / 1000);
        setStats(p => ({ ...p, elapsed: `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` }));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [game?.status]);

  // WebSocket events
  useEffect(() => {
    if (!game?.id) return;
    const unsub1 = ws.on('leaderboard.updated', (data: any) => {
      setLeaderboard(data.data?.leaderboard || []);
      setStats(p => ({ ...p, attempts: data.data?.leaderboard?.length || 0 }));
    });
    const unsub2 = ws.on('game.started', () => setGame((g: any) => ({ ...g, status: 'active' })));
    const unsub3 = ws.on('game.finished', () => setGame((g: any) => ({ ...g, status: 'finished' })));
    ws.subscribe(game.id);
    return () => { unsub1?.(); unsub2?.(); unsub3?.(); };
  }, [game?.id]);

  const apiCall = useCallback(async (method: string, path: string, body?: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}${path}`, {
        method, headers: { 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      return await res.json();
    } catch (e: any) {
      console.error('API Error:', e);
      return null;
    } finally { setLoading(false); }
  }, []);

  const handleAction = useCallback(async (action: string) => {
    if (action === 'create') {
      const s = await apiCall('POST', '/api/streams', { streamerId: '00000000-0000-0000-0000-000000000001' });
      const g = await apiCall('POST', '/api/games', { streamId: s?.id || '00000000-0000-0000-0000-000000000001', secretWord: 'hotel', secretWordId: '00000000-0000-0000-0000-000000000001' });
      if (g) setGame(g);
    } else if (action === 'hint') {
      const h = await apiCall('POST', `/api/games/${game?.id}/hint`);
      if (h) setHint(h.hint);
    } else {
      const g = await apiCall('POST', `/api/games/${game?.id}/${action}`);
      if (g) setGame(g);
    }
  }, [game?.id, apiCall]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold gradient-text">Integra Contexto</h1>
        <span className={`text-xs px-3 py-1 rounded-full ${ws.status === 'connected' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
          WS: {ws.status}
        </span>
      </header>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-4">
          <StatusPanel game={game} status={ws.status} stats={stats} />
          <GameControls game={game} loading={loading} onAction={handleAction} />
          {hint && (
            <div className="card">
              <p className="text-sm text-amber-400">💡 {hint}</p>
            </div>
          )}
        </div>
        <div className="md:col-span-3">
          <Leaderboard entries={leaderboard} />
        </div>
      </div>
    </div>
  );
}