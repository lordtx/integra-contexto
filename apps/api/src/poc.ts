import { createPirateTokAdapter } from '@integra/tiktok';

async function poc() {
  const adapter = createPirateTokAdapter();
  adapter.on({
    onConnected: () => console.log('[POC TikTok API] Conectado'),
    onEvent: (event) => console.log('[POC TikTok API] Evento:', event.type, event.message),
    onError: (err) => console.error('[POC TikTok API] Erro:', err),
  });

  await adapter.connect({ sessionId: 'poc-api-session' });

  // Coleta por 15 segundos
  await new Promise((r) => setTimeout(r, 15000));
  await adapter.disconnect();
  console.log('[POC TikTok API] Finalizado');
}

poc().catch(console.error);