# DermaScan Frontend

Frontend da aplicação DermaScan desenvolvido com React, Vite e TypeScript.

## Pré-requisitos

Instale:

```bash
Node.js
npm
Docker
```

## Rodar sem Docker

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:4000
```

Execute o frontend:

```bash
npm run dev
```

Abra no navegador:

```txt
http://localhost:5173
```

## Rodar com Dockerfile

Dentro da pasta `frontend`, crie o arquivo `.env.production`:

```env
VITE_API_URL=http://localhost:4000
```

Depois gere a imagem Docker:

```bash
docker build -t dermascan-frontend .
```

Execute o container:

```bash
docker run --rm -p 8080:80 dermascan-frontend
```

Abra no navegador:

```txt
http://localhost:8080
```

## Verificar o projeto

```bash
npm run typecheck
npm run lint
npm run build
```
