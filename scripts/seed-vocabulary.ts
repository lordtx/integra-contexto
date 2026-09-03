import { config } from 'dotenv'; config();
import { getDb, runMigrations } from '@integra/database';
import { LocalEmbedding, normalizeWord } from '@integra/game-engine';

const VOCABULARY = [
  // Natureza
  'natureza', 'montanha', 'floresta', 'rio', 'cachoeira', 'mar', 'oceano', 'lago', 'deserto', 'campo',
  'arvore', 'flor', 'grama', 'folha', 'tronco', 'galho', 'raiz', 'semente', 'fruto', 'petala',
  'sol', 'lua', 'estrela', 'ceu', 'nuvem', 'chuva', 'vento', 'neve', 'gelo', 'temporal',
  'areia', 'pedra', 'terra', 'barro', 'rocha', 'vale', 'colina', 'penhasco', 'caverna', 'ilha',
  // Animais
  'cachorro', 'gato', 'passaro', 'peixe', 'cavalo', 'vaca', 'porco', 'galinha', 'pato', 'coelho',
  'leao', 'tigre', 'urso', 'lobo', 'raposa', 'veado', 'macaco', 'elefante', 'girafa', 'zebra',
  'golfinho', 'baleia', 'tubarao', 'polvo', 'caranguejo', 'tartaruga', 'cobra', 'lagarto', 'sapo', 'abelha',
  // Viagem
  'hotel', 'hospedagem', 'resort', 'pousada', 'hostel', 'motel', 'viagem', 'turismo', 'aviao', 'aeroporto',
  'trem', 'onibus', 'taxi', 'uber', 'carro', 'moto', 'barco', 'navio', 'cruzeiro', 'estrada',
  'mapa', 'rota', 'destino', 'passagem', 'bagagem', 'mala', 'mochila', 'passaporte', 'visto', 'fronteira',
  // Comida
  'comida', 'restaurante', 'cozinha', 'receita', 'ingrediente', 'prato', 'sabor', 'tempero', 'acucar', 'sal',
  'pao', 'queijo', 'leite', 'ovo', 'carne', 'frango', 'peixe', 'arroz', 'feijao', 'macarrao',
  'pizza', 'hamburguer', 'salada', 'sopa', 'bolo', 'sorvete', 'chocolate', 'cafe', 'cha', 'suco',
  // Casa
  'casa', 'apartamento', 'quarto', 'sala', 'cozinha', 'banheiro', 'garagem', 'quintal', 'varanda', 'porta',
  'janela', 'teto', 'parede', 'chao', 'escada', 'moveis', 'mesa', 'cadeira', 'sofa', 'cama',
  'geladeira', 'fogao', 'microondas', 'televisao', 'computador', 'lampada', 'tapete', 'cortina', 'quadro', 'vaso',
  // Esportes
  'esporte', 'futebol', 'basquete', 'volei', 'tenis', 'natacao', 'corrida', 'ciclismo', 'skate', 'surf',
  'ginastica', 'yoga', 'pilates', 'musculacao', 'boxe', 'luta', 'capoeira', 'atletismo', 'golfe', 'rugby',
  // Tecnologia
  'computador', 'celular', 'internet', 'software', 'hardware', 'aplicativo', 'site', 'servidor', 'nuvem', 'dados',
  'programacao', 'algoritmo', 'inteligencia', 'artificial', 'robotica', 'automacao', 'rede', 'wifi', 'bluetooth', 'sensor',
  // Trabalho
  'trabalho', 'emprego', 'profissao', 'carreira', 'escritorio', 'reuniao', 'projeto', 'prazo', 'meta', 'salario',
  'cliente', 'fornecedor', 'parceiro', 'chefe', 'colega', 'equipe', 'lideranca', 'gestao', 'plano', 'relatorio',
  // Saude
  'saude', 'medico', 'hospital', 'clinica', 'farmacia', 'remedio', 'vacina', 'cirurgia', 'exame', 'dente',
  'dor', 'febre', 'gripe', 'resfriado', 'alergia', 'diabetes', 'pressao', 'coracao', 'pulmao', 'sangue',
  // Educação
  'escola', 'faculdade', 'universidade', 'professor', 'aluno', 'aula', 'livro', 'caderno', 'caneta', 'lapis',
  'prova', 'nota', 'materia', 'disciplina', 'curso', 'ensino', 'aprendizado', 'conhecimento', 'sabedoria', 'estudo',
  // Cidades
  'cidade', 'capital', 'bairro', 'centro', 'rua', 'avenida', 'praca', 'parque', 'ponte', 'tunel',
  'predio', 'loja', 'mercado', 'shopping', 'cinema', 'teatro', 'museu', 'biblioteca', 'igreja', 'estadio',
  // Clima
  'clima', 'tempo', 'temperatura', 'calor', 'frio', 'umido', 'seco', 'chuvoso', 'ensolarado', 'nublado',
  'nevoeiro', 'granizo', 'tempestade', 'furacao', 'tornado', 'geada', 'orvalho', 'arcoiris', 'relampago', 'tufao',
  // Natacao
  'praia', 'areia', 'mar', 'onda', 'sol', 'protetor', 'toalha', 'canga', 'guardasol', 'cooler',
];

async function main() {
  console.log('Seeding vocabulary...');
  const db = getDb();
  await runMigrations();
  const emb = new LocalEmbedding();
  let count = 0;
  for (const word of VOCABULARY) {
    const normalized = normalizeWord(word);
    if (!normalized) continue;
    const existing = await db('words').where({ normalized_word: normalized, language: 'pt' }).first();
    if (existing) continue;
    const vector = emb.generate(word);
    const padded = [...vector, ...new Array(668).fill(0)];
    await db('words').insert({ word, normalized_word: normalized, language: 'pt', embedding: `[${padded.join(',')}]` });
    count++;
  }
  console.log(`${count} words seeded (total: ${await db('words').count('* as t').then(r => r[0]?.t)})`);
  await db.destroy();
}

main().catch(console.error);