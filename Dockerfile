FROM node:22-alpine AS builder
WORKDIR /app

# Copy root configs
COPY package.json tsconfig.base.json ./

# Copy all workspace manifests
COPY packages/types/package.json ./packages/types/
COPY packages/tiktok/package.json ./packages/tiktok/
COPY packages/database/package.json ./packages/database/
COPY packages/game-engine/package.json ./packages/game-engine/
COPY packages/realtime/package.json ./packages/realtime/
COPY apps/worker/package.json ./apps/worker/

RUN npm install

# Copy source code
COPY packages/types ./packages/types
COPY packages/tiktok ./packages/tiktok
COPY packages/database ./packages/database
COPY packages/game-engine ./packages/game-engine
COPY packages/realtime ./packages/realtime
COPY apps/worker ./apps/worker

CMD ["npx", "tsx", "apps/worker/src/index.ts"]