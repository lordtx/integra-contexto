# Integra Contexto

Plataforma self-hosted de jogos interativos para transmissões ao vivo.

**Primeiro jogo:** Integra Contexto — jogo semântico multiplayer via chat da LIVE.

## ⚡ POC — TikTok Adapter (Fase 1)

✅ **Status: Concluído — Usando PirateTok/live-js** (0BSD license)

O adapter se conecta a qualquer LIVE do TikTok usando **apenas o username do streamer** — sem API key, sem servidor externo, sem custo.

### Como testar

```bash
# 1. Instalar dependências
npm install

# 2. Executar o POC
npx tsx apps/api/src/poc.ts <username_do_streamer>
```

### Exemplo de saída

```
╔══════════════════════════════════════════════╗
║     INTEGRA CONTEXTO — POC TikTok Adapter   ║
╚══════════════════════════════════════════════╝

  ✅ Conectado à LIVE de @joaosilva

  💬 #1 │ @maria: "praia"
     ↳ Normalizado: "praia"
     ↳ Pipeline: validar → rate limit → dedup → embedding → ranking
  ➕ FOLLOW │ @pedro começou a seguir!
  🎁 GIFT   │ @lucas enviou Rosas (100💎 x5)
```

### Eventos capturados (64 tipos via PirateTok)

| Evento | Descrição |
|--------|-----------|
| `chat.message` | Mensagem no chat |
| `follow` | Novo seguidor |
| `gift` | Gift enviado |
| `like` | Curtida |
| `join` | Entrou na LIVE |
| `share` | Compartilhou |
| `liveEnded` | LIVE encerrada |

## Arquitetura

```
TikTok LIVE App
    ↓
[PirateTok WebSocket] ← 0BSD, sem API key
    ↓
TikTok Adapter (pacote @integra/tiktok)
    ↓
Normalized Events (contrato @integra/types)
    ↓
Redis / BullMQ
    ↓
Worker
    ↓
Game Engine
    ↓
PostgreSQL + pgvector + WebSocket
    ↓
Dashboard + Overlay
```

## Stack

- **Frontend:** Next.js, React, Tailwind, shadcn/ui
- **Backend:** NestJS + Fastify
- **Banco:** PostgreSQL + pgvector
- **Cache/Filas:** Redis + BullMQ
- **Realtime:** WebSocket
- **Integração TikTok:** PirateTok/live-js (WebSocket direto)
- **Infra:** Docker, Coolify, Traefik, Cloudflare

## Estrutura

```
integra-contexto/
├── apps/
│   ├── web/          # Next.js (dashboard + overlay)
│   ├── api/          # Fastify API (POC rodando)
│   ├── worker/       # BullMQ workers
│   └── engine/       # Game engine standalone
├── packages/
│   ├── database/     # Schema, migrations
│   ├── types/        # Tipos compartilhados (event contracts)
│   ├── ui/           # Componentes compartilhados
│   ├── tiktok/       # TikTok adapter (PirateTok)
│   └── game-engine/  # Core do jogo
├── infrastructure/   # Dockerfiles
├── docs/             # Documentação
└── docker-compose.yml
```

## Roadmap

| Fase | O que | Status |
|------|-------|--------|
| 1 | POC TikTok Adapter | ✅ Concluído (PirateTok) |
| 2 | Core (Game Engine, DB, Redis) | ⏳ Pendente |
| 3 | Interface (Dashboard, Overlay) | ⏳ Pendente |
| 4 | Produção (Security, Load test) | ⏳ Pendente |

## Infraestrutura

```bash
docker compose up -d
```

- `dtxnet.top` — Landing page
- `api.dtxnet.top` — API
- `overlay.dtxnet.top` — Overlay OBS
- `ws.dtxnet.top` — WebSocket

## Licença

Projeto privado — lordtx/integra-contexto