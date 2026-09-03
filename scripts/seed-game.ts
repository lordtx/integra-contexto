import { config } from 'dotenv'; config();
import { getDb } from '@integra/database';

async function main() {
  const db = getDb();
  const secretWord = 'hotel';
  let secret = await db('words').where({ normalized_word: secretWord, language: 'pt' }).first();
  if (!secret) {
    const { LocalEmbedding, normalizeWord } = await import('@integra/game-engine');
    const emb = new LocalEmbedding();
    const normalized = normalizeWord(secretWord)!;
    const vector = emb.generate(secretWord);
    const padded = [...vector, ...new Array(668).fill(0)];
    [secret] = await db('words').insert({ word: secretWord, normalized_word: normalized, language: 'pt', embedding: `[${padded.join(',')}]` }).returning('*');
  }
  const [streamer] = await db('users').insert({ platform_user_id: 'streamer_teste', platform: 'tiktok', username: 'streamer_teste', is_streamer: true }).onConflict(['platform', 'platform_user_id']).merge().returning('*');
  const [stream] = await db('streams').insert({ streamer_id: streamer.id, platform_stream_id: 'live_teste', status: 'active' }).returning('*');
  const [game] = await db('games').insert({ stream_id: stream.id, game_type: 'context', secret_word_id: secret.id, status: 'draft' }).returning('*');
  console.log(`Game created!`);
  console.log(`  game_id: ${game.id}`);
  console.log(`  secret_word: ${secretWord}`);
  console.log(`  stream_id: ${stream.id}`);
  console.log(`  streamer_id: ${streamer.id}`);
  console.log('');
  console.log('Start the game:');
  console.log(`  curl -X POST http://localhost:3001/api/games/${game.id}/start`);
  console.log('');
  console.log('Check leaderboard:');
  console.log(`  curl http://localhost:3001/api/games/${game.id}/leaderboard`);
  await db.destroy();
}
main().catch(console.error);