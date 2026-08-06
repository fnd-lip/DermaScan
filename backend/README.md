# DermaScan Backend

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- JWT
- Docker

## Pré-requisitos

Antes de rodar o backend, instale:

- Node.js 22 ou superior
- npm
- PostgreSQL local, remoto ou executado com Docker

## Instalar dependências

Dentro da pasta `backend`, execute:

```bash
npm install
```

## Configurar variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `backend`:

```env
PORT=4000
FRONTEND_URL="http://localhost:5173"

DATABASE_URL="sua_url_do_postgresql"

JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="7d"

NODE_ENV="development"

ML_SERVICE_URL="http://localhost:5001"
```

Exemplo usando banco local PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/dermascan_db?schema=public"
```

Exemplo usando banco remoto, como Neon:

```env
DATABASE_URL="postgresql://usuario:senha@host-do-banco/neondb?sslmode=require"
```

## Gerar Prisma Client

Depois de configurar o `.env`, execute:

```bash
npm run prisma:generate
```

## Rodar migrações

Para ambiente de desenvolvimento:

```bash
npm run prisma:migrate
```

Para ambiente de produção:

```bash
npm exec -- prisma migrate deploy
```

## Rodar o backend

Dentro da pasta `backend`, execute:

```bash
npm run dev
```

O backend ficará disponível em:

```txt
http://localhost:4000
```

## Testar se o backend está funcionando

Acesse no navegador:

```txt
http://localhost:4000/health
```

Ou use:

```bash
curl http://localhost:4000/health
```

## Integração com o ML Service

O backend depende do serviço de Machine Learning para classificar as imagens.

Para rodar localmente, o `.env` deve apontar para:

```env
ML_SERVICE_URL="http://localhost:5001"
```

Antes de testar a classificação de imagens, confirme se o ML Service está rodando na porta `5001`.

## Rodar com Docker

Dentro da pasta `backend`, gere a imagem:

```bash
docker build -t dermascan-backend .
```

## Scripts úteis

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run lint:fix
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm exec -- prisma migrate deploy
```

## Observação

O backend salva imagens enviadas pelo usuário na pasta `uploads`.

Em execução local com `npm run dev`, os arquivos são salvos na pasta `backend/uploads`. Em execução com Docker, a pasta deve ser montada como volume para que os arquivos não sejam perdidos ao encerrar o contêiner. 
