FROM node:22.23.1-alpine3.24 AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci \
    --ignore-scripts \
    --audit=false \
    --fund=false


FROM node:22.23.1-alpine3.24 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src

RUN DATABASE_URL="postgresql://ci_user@localhost:5432/dermascan_ci?schema=public" \
    ./node_modules/.bin/prisma generate

RUN npm run build

RUN mkdir -p dist/src/generated \
    && cp -R src/generated/prisma dist/src/generated/prisma


FROM node:22.23.1-alpine3.24 AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm ci \
    --omit=dev \
    --ignore-scripts \
    --audit=false \
    --fund=false \
    && npm cache clean --force

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma.config.ts ./prisma.config.ts

RUN mkdir -p uploads \
    && chown -R node:node uploads

USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- "http://127.0.0.1:${PORT:-4000}/health" || exit 1

CMD ["npm", "run", "start"]
