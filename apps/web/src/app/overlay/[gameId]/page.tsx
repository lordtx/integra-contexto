'use client';

import { useEffect, useState } from 'react';
type Guess = { word: string; user: string; score: number };
type Session = { channel: string; connected: boolean; round: 'idle' | 'ready' | 'live' | 'paused' | 'finished'; guesses: Guess[]; hint: string };
const KEY = 'integra-contexto-session';
const empty: Session = { channel: '', connected: false, round: 'idle', guesses: [], hint: '' };
function readSession() { try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }; } catch { return empty; } }
export default function GameOverlayPage() {
  const [session, setSession] = useState<Session>(empty);
  useEffect(() => { const sync = () => setSession(readSession()); sync(); window.addEventListener('storage', sync); const timer = window.setInterval(sync, 1000); return () => { window.removeEventListener('storage', sync); window.clearInterval(timer); }; }, []);
  const ranking = [...session.guesses].sort((a, b) => b.score - a.score).slice(0, 3);
  const title = session.round === 'live' ? 'AO VIVO' : session.round === 'paused' ? 'PAUSADO' : session.round === 'finished' ? 'RODADA ENCERRADA' : 'AGUARDANDO RODADA';
  return <main className="game-overlay"><section className="overlay-panel"><header className="overlay-header"><div><span className={`overlay-live ${session.round === 'live' ? 'on' : ''}`}><i /> {title}</span><h1>Contexto</h1></div><span className="overlay-channel">{session.channel ? `@${session.channel}` : 'integra.live'}</span></header><div className="overlay-goal"><span>DESCUBRA A PALAVRA SECRETA</span><strong>{session.round === 'live' ? '••••••••' : 'PREPARE A PRÓXIMA RODADA'}</strong><p>{session.hint || 'O apresentador libera a primeira dica ao começar.'}</p></div><section className="overlay-ranking"><div className="overlay-ranking-head"><span>MELHORES DO CHAT</span><span>{session.guesses.length} tentativas</span></div>{ranking.length ? ranking.map((guess, index) => <div className="overlay-row" key={`${guess.word}-${index}`}><b>{index + 1}</b><strong>{guess.word}</strong><span>{guess.user}</span><em>{guess.score}%</em></div>) : <div className="overlay-empty">As palavras do chat vão aparecer aqui.</div>}</section><footer>integra contexto <span>•</span> participe pelo chat</footer></section></main>;
}
