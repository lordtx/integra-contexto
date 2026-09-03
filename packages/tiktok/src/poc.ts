import { createPirateTokAdapter } from './index.js';

async function main() {
  const adapter = createPirateTokAdapter();

  adapter.on({
    onConnected: () => console.log('Conectado ao TikTok'),
    onEvent: (event) => console.log('Evento recebido:', event),
    onError: (err) => console.error('Erro:', err),
    onDisconnected: () => console.log('Desconectado'),
  });

  await adapter.connect({ sessionId: 'test-session' });

  // Aguarda 10 segundos coletando eventos
  await new Promise((resolve) => setTimeout(resolve, 10000));

  await adapter.disconnect();
  console.log('POC finalizada');
}

main().catch(console.error);