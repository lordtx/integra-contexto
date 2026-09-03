// ============================================================
// POC-01: TikTok Adapter — Prova de Conceito
// ============================================================
// Uso: npx tsx apps/api/src/poc.ts <username_do_streamer>
// Exemplo: npx tsx apps/api/src/poc.ts fulano
// ============================================================

import { createPirateTokAdapter } from '@integra/tiktok';

const STREAMER_USERNAME = process.argv[2];
if (!STREAMER_USERNAME) {
  console.error('\n  ❌ Uso: tsx poc.ts <username_do_streamer>\n');
  process.exit(1);
}

console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║     INTEGRA CONTEXTO — POC TikTok Adapter   ║');
console.log('║     PirateTok (0BSD) · Sem API Key          ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const adapter = createPirateTokAdapter();

const stats = { chats: 0, follows: 0, gifts: 0, likes: 0, startTime: Date.now() };

function normalizeWord(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9áéíóúâêôãõç ]/g, '')
    .trim()
    .substring(0, 50);
}

function printStats(): void {
  const elapsed = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  console.log('\n  ┌─ Relatório do POC ──────────────────────────┐');
  console.log(`  │  💬 Chats:     ${String(stats.chats).padStart(6)} │`);
  console.log(`  │  ➕ Follows:   ${String(stats.follows).padStart(6)} │`);
  console.log(`  │  🎁 Gifts:     ${String(stats.gifts).padStart(6)} │`);
  console.log(`  │  ❤️ Likes:     ${String(stats.likes).padStart(6)} │`);
  console.log(`  │  ⏱ Tempo:     ${elapsed.padStart(6)}s   │`);
  console.log('  └────────────────────────────────────────────┘');
}

adapter.connect(
  { streamerUsername: STREAMER_USERNAME },
  {
    onConnected: () => {
      console.log(`  ✅ Conectado à LIVE de @${STREAMER_USERNAME}`);
      console.log(`  🕐 ${new Date().toLocaleTimeString('pt-BR')}\n`);
      console.log('  ┌─ Eventos em tempo real ─────────────────────┐');
    },
    onDisconnected: () => {
      console.log('\n  ╔══════════════════════════════════════════╗');
      console.log('  ║   ❌ Desconectado da LIVE               ║');
      console.log('  ╚══════════════════════════════════════════╝');
      printStats();
    },
    onChat: (event) => {
      stats.chats++;
      const msg = event.message.substring(0, 80);
      console.log(`  💬 #${stats.chats} │ @${event.user.username}: "${msg}"`);
      const word = normalizeWord(event.message);
      if (word && !word.startsWith('!')) {
        console.log(`     ↳ Normalizado: "${word}" → pipeline: validar → rate limit → dedup → embedding → ranking`);
      }
    },
    onFollow: (event) => {
      stats.follows++;
      console.log(`  ➕ FOLLOW │ @${event.user.username} começou a seguir!`);
    },
    onGift: (event) => {
      stats.gifts++;
      console.log(`  🎁 GIFT   │ @${event.user.username} enviou ${event.giftName} (${event.diamondCount}💎 x${event.repeatCount})`);
    },
    onError: (error) => console.error(`  ❌ Erro: ${error.message}`),
  },
);

process.on('SIGINT', async () => {
  console.log('\n  ⏹  Encerrando...');
  await adapter.disconnect();
  printStats();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await adapter.disconnect();
  process.exit(0);
});