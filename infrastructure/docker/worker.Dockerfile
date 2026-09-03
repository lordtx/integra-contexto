FROM node:20-alpine AS base

WORKDIR /app

# Copy monorepo
COPY package.json tsconfig.base.json ./
COPY apps/worker ./apps/worker
COPY packages ./packages

# Install dependencies
RUN npm install

CMD ["npm", "run", "--prefix", "apps/worker", "dev"]