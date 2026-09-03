FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json tsconfig.base.json ./
COPY packages/types ./packages/types
COPY packages/tiktok ./packages/tiktok
COPY apps/api ./apps/api

RUN npm install && npm run build --workspaces

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]