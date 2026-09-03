# Integra Contexto

Plataforma self-hosted de jogos interativos para transmissões ao vivo.

**Primeiro jogo:** Integra Contexto — jogo semântico multiplayer via chat da LIVE.

---

## ✅ Status do Projeto

| Módulo | Status | Descrição |
|--------|--------|-----------|
| TikTok Adapter | ✅ **Concluído** | PirateTok/live-js (0BSD, sem API key) |
| Database Schema | ✅ **Concluído** | PostgreSQL + pgvector (8 tabelas) |
| Game Engine | ✅ **Concluído** | 7 módulos: GameManager, WordManager, SemanticEngine, RankingEngine, HintEngine, ScoreEngine, LocalEmbedding |
| BullMQ Workers | ✅ **Concluído** | 4 filas: tiktok-events, process-guesses, calculate-score, broadcast-events |
| WebSocket Gateway | ✅ **Concluído** | Redis Pub/Sub + salas por gameId |
| API REST | ✅ **Concluído** | Fastify + rotas de games, streams, words |
| Seed Vocabulary | ✅ **Concluído** | 340+ palavras em português com embeddings |
| Dashboard / Overlay | ⏳ **Pendente** | Next.js |

---

## ⚡ Como usar

```bash
# 1. Instalar dependências
npm install

# 2. Subir infraestrutura
docker compose up -d

# 3. Seed do vocabulário
npm run seed:vocab

# 4. Criar jogo de teste
npm run seed:game

# 5. Testar conexão TikTok
npx tsx apps/api/src/poc.ts <username_do_streamer>
```

### Endpoints da API

```
GET  /health                    → Status do servidor
GET  /status                    → Status detalhado (DB, jogos, palavras)
POST /api/games                 → Criar novo jogo
GET  /api/games/:id             → Detalhe do jogo
POST /api/games/:id/start       → Iniciar jogo
POST /api/games/:id/pause       → Pausar jogo
POST /api/games/:id/resume      → Retomar jogo
POST /api/games/:id/finish      → Finalizar jogo
POST /api/games/:id/hint        → Gerar dica
GET  /api/games/:id/leaderboard → Ranking atual
POST /api/streams               → Registrar live
POST /api/streams/:id/end       → Finalizar live
GET  /api/streams/active        → Live ativa
GET  /api/words/search?q=       → Buscar palavras
POST /api/words                 → Adicionar palavra
```

### WebSocket

Conecte em `ws://ws.dtxnet.top` e envie:

```json
{"type": "subscribe", "gameId": "game_xxx"}
```

Eventos recebidos:

```json
{"event": "leaderboard.updated", "gameId": "game_xxx", "data": {...}}
{"event": "game.started", "gameId": "game_xxx"}
{"event": "game.finished", "gameId": "game_xxx"}
```

---

## Arquitetura

```
TikTok LIVE App
    ↓
[PirateTok WebSocket] → 0BSD, sem API key, só username
    ↓
TikTok Adapter (packages/tiktok)
    ↓
Normalized Events (packages/types)
    ↓
┌──────────────────────────────────┐
│         REDIS / BullMQ           │
│  tiktok-events → process-guesses │
│  calculate-score → broadcast     │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│           WORKER                 │
│  process-chat → process-guess    │
│  → score → broadcast             │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│         GAME ENGINE              │
│  GameManager · SemanticEngine    │
│  RankingEngine · ScoreEngine     │
│  HintEngine · WordManager        │
│  LocalEmbedding (trigram)        │
└────────────┬─────────────────────┘
             ↓
    ┌───────┼───────────┐
    ↓       ↓           ↓
PostgreSQL Redis   WebSocket Gateway
+pgvector  Cache   (packages/realtime)
                    ↓
              Dashboard + Overlay
```

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js, React, Tailwind, shadcn/ui (futuro) |
| Backend | Fastify (Node.js 22+) |
| Banco | PostgreSQL 16 + pgvector |
| Cache/Filas | Redis 7 + BullMQ |
| Realtime | WebSocket (ws) + Redis Pub/Sub |
| Integração TikTok | PirateTok/live-js (WebSocket direto, 0BSD) |
| Infra | Docker, Coolify, Traefik, Cloudflare |
| Domínio | dtxnet.top |

---

## Pipeline de Processamento

```
Chat da LIVE
    ↓ TikTok Adapter (PirateTok WebSocket)
    ↓ normalizeWord() — limpa, normaliza, valida
    ↓ Rate limit (5 msg/10s por usuário) — Redis
    ↓ Deduplicação — Redis SET NX (5min TTL)
    ↓ BullMQ: tiktok-events → process-guesses
    ↓ Busca/cria word no PostgreSQL
    ↓ Busca embedding + calcula score
    ↓ RankingEngine.addGuess()
    ↓ Persiste guess + leaderboard
    ↓ BullMQ: broadcast-events → Redis Pub/Sub
    ↓ WebSocket Gateway → Dashboard + Overlay
```

---

## Domínios

```
dtxnet.top            → Landing page
api.dtxnet.top        → API + endpoints REST
ws.dtxnet.top         → WebSocket Gateway
overlay.dtxnet.top    → Overlay OBS
app.dtxnet.top        → Dashboard (futuro)
```

---

## Licença

Projeto privado — lordtx/integra-contexto