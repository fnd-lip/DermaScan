FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm install

COPY . .

RUN npm exec -- prisma generate
RUN npm run build
RUN mkdir -p dist/src/generated && cp -R src/generated/prisma dist/src/generated/prisma

EXPOSE 4000

CMD ["npm", "run", "start"]