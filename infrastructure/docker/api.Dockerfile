FROM node:20-alpine AS base

WORKDIR /app

# Copy monorepo
COPY package.json tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages ./packages

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "--prefix", "apps/api", "dev"]