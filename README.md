# DermaScan 

O **DermaScan** é um projeto básico para classificação assistida de lesões dermatológicas.

O projeto possui frontend em React, backend em Express.js, autenticação com JWT, banco PostgreSQL via Docker e histórico de análises separado por usuário.

## Tecnologias principais

- React + Vite
- TypeScript
- Express.js
- Prisma
- PostgreSQL
- Docker
- JWT

## Como rodar o projeto

### 1. Subir o banco de dados

Na raiz do projeto:

```bash
docker compose up -d
```

### 2. Rodar o backend

Entre na pasta do backend:

```bash
cd backend
npm install
npm run dev
```

O backend ficará disponível em:

```txt
http://localhost:4000
```

### 3. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em:

```txt
http://localhost:5173
```

## Variáveis de ambiente do backend

Crie um arquivo `.env` dentro da pasta `backend`:

```env
PORT=4000
FRONTEND_URL="http://localhost:5173"
DATABASE_URL="postgresql://dermascan:dermascan123@127.0.0.1:5432/dermascan_db?schema=public"
JWT_SECRET="dermascan_jwt_secret_dev_123"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

## Funcionalidades

- Cadastro e login de usuário
- Autenticação com JWT
- Sessão persistente
- Classificação simulada de lesões dermatológicas
- Histórico de análises por usuário
- Exclusão de laudos
- Interface acadêmica para demonstração

## Aviso

Esse projeto possui finalidade apenas demonstrativa. Os resultados gerados não substituem avaliação médica ou diagnóstico dermatológico profissional.
