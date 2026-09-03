import { GameManager } from '@integra/game-engine';
import { createPirateTokAdapter } from '@integra/tiktok';

async function runPoc() {
  console.log('=== POC Integra Contexto ===');

  // Inicializa engine
  const gameManager = new GameManager();
  const game = gameManager.createGame('poc-stream', 3);
  console.log('Game created:', game.id);

  // Adiciona palavras
  const words = [
    { word: 'Elefante', category: 'Animais', difficulty: 1, hints: ['Tromba longa'] },
    { word: 'Python', category: 'Programação', difficulty: 3, hints: ['Linguagem'] },
    { word: 'Piano', category: 'Música', difficulty: 2, hints: ['Teclas'] },
  ];
  for (const w of words) {
    gameManager['wordManager'].addWord(w);
  }

  // Conecta TikTok
  const adapter = createPirateTokAdapter();
  adapter.on({
    onConnected: () => console.log('TikTok conectado'),
    onEvent: (ev) => console.log('Evento:', ev.type, ev.message),
  });
  await adapter.connect({ sessionId: 'poc-session' });

  // Inicia jogo
  await gameManager.startGame();
  console.log('Game started:', gameManager.getGame()?.currentWord);

  // Simula palpites
  const guessResult = await gameManager.submitGuess('user1', 'Player1', 'elefante');
  console.log('Guess result:', guessResult);

  console.log('Ranking:', gameManager.getRanking());

  // Finaliza
  gameManager.endGame();
  await adapter.disconnect();
  console.log('POC finalizada');
}

runPoc().catch(console.error);