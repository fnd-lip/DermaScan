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

## Variáveis de ambiente do Docker Compose

Crie um arquivo `.env` na raiz do projeto, no mesmo local do arquivo `docker-compose.yml`:

```env
POSTGRES_PASSWORD="SUA_SENHA_POSTGRES"
```

O arquivo `.env` contém configurações locais e não deve ser versionado.

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
DATABASE_URL="postgresql://dermascan:SUA_SENHA_POSTGRES@127.0.0.1:5432/dermascan_db?schema=public"
JWT_SECRET="GERE_UM_SEGREDO_ALEATORIO_FORTE"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

Use na `DATABASE_URL` a mesma senha definida em `POSTGRES_PASSWORD` no arquivo `.env` da raiz do projeto.

O valor de `JWT_SECRET` deve ser substituído por um segredo longo, aleatório e exclusivo para o ambiente.

## Funcionalidades

- Cadastro e login de usuário
- Autenticação com JWT
- Sessão persistente
- Classificação simulada de lesões dermatológicas
- Histórico de análises por usuário
- Exclusão de laudos
- Interface acadêmica para demonstração
