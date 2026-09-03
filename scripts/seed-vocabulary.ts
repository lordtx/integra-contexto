import { getDb, runMigrations } from '@integra/database';

async function seedVocabulary() {
  console.log('Seeding vocabulary...');
  await runMigrations();
  const db = getDb();

  const words = [
    { word: 'Elefante', category: 'Animais', difficulty: 1, hints: ['Animal de grande porte', 'Tromba longa', 'Orelhas grandes'] },
    { word: 'Girafa', category: 'Animais', difficulty: 1, hints: ['Pescoço comprido', 'Animal africano', 'Mamífero alto'] },
    { word: 'Piano', category: 'Música', difficulty: 2, hints: ['Instrumento musical', 'Teclas pretas e brancas', 'Instrumento de cordas percutidas'] },
    { word: 'Violão', category: 'Música', difficulty: 2, hints: ['Instrumento de cordas', '6 cordas', 'Instrumento acústico'] },
    { word: 'Brasil', category: 'Geografia', difficulty: 1, hints: ['País da América do Sul', 'Maior país lusófono', 'Sede da Copa 2014'] },
    { word: 'Python', category: 'Programação', difficulty: 3, hints: ['Linguagem de programação', 'Criada por Guido van Rossum', 'Nome de uma cobra'] },
    { word: 'Typescript', category: 'Programação', difficulty: 3, hints: ['Superset de JS', 'Tipagem estática', 'Criado pela Microsoft'] },
  ];

  for (const w of words) {
    const normalized = w.word
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    await db('words')
      .insert({
        word: w.word,
        normalized,
        category: w.category,
        difficulty: w.difficulty,
        hints: w.hints,
      })
      .onConflict('normalized')
      .merge();
  }

  console.log(`Seeded ${words.length} words`);
  await db.destroy();
}

seedVocabulary().catch(console.error);