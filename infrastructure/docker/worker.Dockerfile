FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY packages/types ./packages/types
COPY packages/database ./packages/database
COPY packages/game-engine ./packages/game-engine
COPY apps/worker ./apps/worker
RUN npm install && npm run build --workspaces
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/worker/package.json ./apps/worker/
CMD ["node", "apps/worker/dist/index.js"]