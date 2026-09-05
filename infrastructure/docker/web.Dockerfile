# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Root package.json (workspace resolution)
COPY package.json tsconfig.base.json ./

# Web app manifest
COPY apps/web/package.json apps/web/next.config.js apps/web/postcss.config.js apps/web/tailwind.config.ts apps/web/tsconfig.json ./apps/web/

# Source code
COPY apps/web/src ./apps/web/src
COPY apps/web/public ./apps/web/public

# Build web app
WORKDIR /app/apps/web
RUN npm install
RUN npm run build

# Stage 2: Run (standalone)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output (Next.js output: 'standalone' mode)
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]