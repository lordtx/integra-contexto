import { config } from 'dotenv'; config();
import { execSync } from 'child_process';

async function main() {
  console.log('=== Integra Contexto - POC Complete ===');
  console.log('Step 1: Running migrations...');
  execSync('npx tsx scripts/seed-vocabulary.ts', { stdio: 'inherit' });
  console.log('');
  console.log('Step 2: Seeding test game...');
  execSync('npx tsx scripts/seed-game.ts', { stdio: 'inherit' });
  console.log('');
  console.log('Step 3: POC ready!');
  console.log('');
  console.log('To test the TikTok connection:');
  console.log('  npx tsx apps/api/src/poc.ts <username_do_streamer>');
  console.log('');
  console.log('To start the API:');
  console.log('  docker compose up -d');
  console.log('');
}
main().catch(console.error);