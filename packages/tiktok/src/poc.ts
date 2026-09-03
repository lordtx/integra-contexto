// ============================================================
// POC: TikTok Adapter
// ============================================================
import { createPirateTokAdapter } from '@integra/tiktok';
const STREAMER_USERNAME = process.argv[2];
if (!STREAMER_USERNAME) {
  console.error('\n  Uso: tsx poc.ts <username_streamer>\n');
  process.exit(1);
}
const adapter = createPirateTokAdapter();
const stats = { chats: 0, follows: 0, gifts: 0, likes: 0, startTime: Date.now() };
function normalizeWord(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').trim().substring(0, 50);
}
adapter.connect(
  { streamerUsername: STREAMER_USERNAME },
  {
    onConnected: () => console.log(`Conectado a @${STREAMER_USERNAME}`),
    onChat: (event) => {
      stats.chats++;
      console.log(`[#${stats.chats}] @${event.user.username}: "${event.message}"`);
    },
    onFollow: (event) => console.log(`[FOLLOW] @${event.user.username}`),
    onGift: (event) => console.log(`[GIFT] @${event.user.username}: ${event.giftName} x${event.repeatCount}`),
    onError: (e) => console.error(e.message),
  },
);