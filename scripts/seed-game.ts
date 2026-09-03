import { getDb, runMigrations } from '@integra/database';

async function seedGame() {
  console.log('Seeding game...');
  await runMigrations();
  const db = getDb();

  // Cria stream de exemplo
  const [stream] = await db('streams')
    .insert({
      platform: 'tiktok',
      platform_stream_id: 'demo-stream',
      title: 'Live Demo',
      status: 'live',
    })
    .returning('*');

  // Pega algumas palavras
  const words = await db('words').select('*').limit(5);

  // Cria jogo
  const [game] = await db('games')
    .insert({
      stream_id: stream.id,
      status: 'waiting',
      max_rounds: words.length,
    })
    .returning('*');

  console.log(`Game created: ${game.id} for stream ${stream.id}`);
  await db.destroy();
}

seedGame().catch(console.error);