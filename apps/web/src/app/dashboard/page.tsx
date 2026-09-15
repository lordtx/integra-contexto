'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type RoundStatus = 'idle' | 'ready' | 'live' | 'paused' | 'finished';
type Guess = { word: string; user: string; score: number };
type Session = { channel: string; connected: boolean; round: RoundStatus; guesses: Guess[]; hint: string; updatedAt: number };
const SESSION_KEY = 'integra-contexto-session';
const blankSession: Session = { channel: '', connected: false, round: 'idle', guesses: [], hint: 'Aguardando uma rodada', updatedAt: 0 };

function persist(session: Session) {
  const next = { ...session, updatedAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}

export default function DashboardPage() {
  const [session, setSession] = useState<Session>(blankSession);
  const [channel, setChannel] = useState('');
  const [input, setInput] = useState('');
  useEffect(() => { try { const saved = localStorage.getItem(SESSION_KEY); if (saved) setSession(JSON.parse(saved)); } catch {} }, []);
  const update = (changes: Partial<Session>) => setSession(current => persist({ ...current, ...changes }));
  const active = session.connected && ['ready', 'live', 'paused'].includes(session.round);
  const live = session.round === 'live';
  const ranking = useMemo(() => [...session.guesses].sort((a, b) => b.score - a.score), [session.guesses]);
  const label = session.round === 'live' ? 'RODADA AO VIVO' : session.round === 'paused' ? 'PAUSADA' : session.round === 'ready' ? 'PRONTA PARA INICIAR' : session.round === 'finished' ? 'ENCERRADA' : 'SEM RODADA';
  function connect() { const normalized = channel.trim().replace(/^@/, ''); if (!normalized) return; update({ connected: !session.connected, channel: session.connected ? '' : normalized, round: session.connected ? 'idle' : session.round }); }
  function newRound() { update({ round: 'ready', guesses: [], hint: 'Dica 1 liberada: pense no tema da LIVE.' }); }
  function addGuess(event: FormEvent) { event.preventDefault(); const word = input.trim(); if (!word || !live) return; const score = Math.max(12, Math.min(98, word.length * 9 + 17)); update({ guesses: [{ word, user: '@chat-demo', score }, ...session.guesses] }); setInput(''); }
  return <main className="dashboard">
    <header className="topbar"><div><div className="eyebrow">Central da transmissão</div><h1>Integra Contexto</h1></div><div className="top-actions"><span className={`status ${session.connected ? 'live' : ''}`}><i className="dot" />{session.connected ? `@${session.channel}` : 'DESCONECTADO'}</span><Link className="ghost compact" href="/overlay/live" target="_blank">Abrir overlay ↗</Link></div></header>
    <section className="dashboard-grid"><aside className="stack">
      <section className="card"><h2>1. Conecte a transmissão</h2><p className="helper">Informe o @ da LIVE para preparar a sessão. A integração do chat deve estar ativa no servidor para receber mensagens reais.</p><div className="connect-row"><span className="at">@</span><input aria-label="Canal TikTok" value={channel} onChange={e => setChannel(e.target.value)} disabled={session.connected} placeholder="seu_canal" /><button className="button" onClick={connect}>{session.connected ? 'Desconectar' : 'Conectar'}</button></div></section>
      <section className="card"><h2>2. Controle da rodada</h2><div className="session"><div className="session-row"><span>Canal</span><b className={session.connected ? 'good' : 'warn'}>{session.connected ? `@${session.channel}` : 'Aguardando conexão'}</b></div><div className="session-row"><span>Status</span><b className={live ? 'good' : 'warn'}>{label}</b></div></div><button className="control-main" disabled={!session.connected} onClick={newRound}>✦ {session.round === 'ready' ? 'REINICIAR RODADA' : 'NOVA RODADA'}</button><div className="control-grid"><button disabled={session.round !== 'ready' && session.round !== 'paused'} onClick={() => update({ round: 'live' })}>▶ Iniciar</button><button disabled={!live} onClick={() => update({ round: 'paused' })}>Ⅱ Pausar</button><button disabled={session.round !== 'paused'} onClick={() => update({ round: 'live' })}>▶ Retomar</button><button disabled={!active} onClick={() => update({ round: 'finished' })}>■ Finalizar</button></div><button className="hint" disabled={!active} onClick={() => update({ hint: 'Dica extra: observe as palavras mais próximas do ranking.' })}>💡 Liberar dica</button></section>
      <section className="card guide"><h2>Checklist do OBS</h2><ol><li>Abra o overlay em uma janela separada.</li><li>Adicione-o no OBS como “Navegador”.</li><li>Use a URL <code>/overlay/live</code>.</li><li>Inicie a rodada e acompanhe o ranking.</li></ol></section>
    </aside><div className="stack">
      <section className="card"><div className="board-head"><h2>Ranking da rodada</h2><span className="count">{ranking.length} tentativa{ranking.length === 1 ? '' : 's'}</span></div>{ranking.length ? ranking.slice(0, 8).map((guess, index) => <div className="rank-row" key={`${guess.word}-${index}`}><span className="rank">#{index + 1}</span><span className="word">{guess.word}</span><span className="user">{guess.user}</span><span className="score">{guess.score}%</span></div>) : <p className="empty">Quando o chat enviar palavras, as melhores tentativas aparecem aqui e no overlay.</p>}<form className="guess-form" onSubmit={addGuess}><input value={input} onChange={e => setInput(e.target.value)} disabled={!live} placeholder={live ? 'Teste uma palavra do chat…' : 'Inicie a rodada para testar'} /><button disabled={!live}>Enviar</button></form>{live && <p className="notice">Teste local: este campo ajuda a conferir o placar antes ou durante a LIVE.</p>}</section>
      <section className="card stats-card"><div><small>STATUS</small><strong>{label}</strong></div><div><small>MELHOR SCORE</small><strong>{ranking[0]?.score ? `${ranking[0].score}%` : '—'}</strong></div><div><small>DICA ATUAL</small><strong>{session.hint}</strong></div></section>
    </div></section>
  </main>;
}
