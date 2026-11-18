# Sistema de Locação de Veículos

Projeto da disciplina **Programação com Frameworks Web** (UNIPÊ). Sistema web em que usuários autenticados cadastram e consultam veículos, registram locações, acompanham o histórico e finalizam as locações com a devolução do veículo.

## Integrantes

| Nome | Matrícula |
| ---- | --------- |
|      |           |
|      |           |
|      |           |
|      |           |

## Funcionalidades

- Cadastro e login de usuários com senha criptografada (bcrypt) e autenticação por JWT.
- Cadastro de veículos com validação de placa única e diária positiva.
- Listagem de veículos com filtro de disponibilidade, categoria e busca por marca, modelo ou placa.
- Registro de locação com cálculo do valor total no backend.
- Listagem das locações do usuário, incluindo o histórico das finalizadas.
- Finalização da locação, registrando a data de devolução e liberando o veículo.

## Tecnologias

| Camada   | Stack                                                               |
| -------- | ------------------------------------------------------------------- |
| Backend  | Node.js, Express 5, TypeScript, Prisma ORM, MySQL, JWT, bcrypt, Zod |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, React Router            |
| Deploy   | Vercel (API como Serverless Function + SPA estática)                |

## Estrutura

```
.
├── backend
│   ├── api/index.ts            entrada da Serverless Function (Vercel)
│   ├── prisma/                 schema.prisma, migrations e seed
│   ├── requests.http           coleção de requisições para demonstrar a API
│   └── src
│       ├── app.ts              configuração do Express e rotas
│       ├── server.ts           servidor local
│       ├── config/             variáveis de ambiente
│       ├── lib/                Prisma Client, JWT e utilitários
│       ├── middlewares/        autenticação e tratamento de erros
│       └── modules/            auth, vehicles e rentals
│                               (routes → controller → service → Prisma)
└── frontend
    └── src
        ├── components/         layout, guarda de rotas e componentes de UI
        ├── contexts/           contexto de autenticação
        ├── lib/                cliente HTTP, formatações e fotos dos veículos
        └── pages/              telas da aplicação
```

Cada módulo do backend separa as responsabilidades:

- **Routes** mapeiam os endpoints e aplicam o middleware `authenticate`.
- **Controllers** validam a entrada HTTP com Zod e devolvem a resposta com o status adequado.
- **Services** concentram as regras de negócio e o acesso ao banco via Prisma.

## Modelo de dados

- **User** (`users`): `id`, `name`, `email` (único), `password` (hash bcrypt), `createdAt`.
- **Vehicle** (`vehicles`): `id`, `brand`, `model`, `year`, `plate` (única), `color`, `category`, `dailyRate`, `available`.
- **Rental** (`rentals`): `id`, `userId` (FK), `vehicleId` (FK), `startDate`, `expectedReturnDate`, `returnedAt` (opcional), `dailyRate`, `totalAmount`, `status` (`ACTIVE` ou `FINISHED`).

Relacionamentos: um usuário possui várias locações e um veículo possui várias locações ao longo do tempo (ambos 1:N).

## Regras de negócio

- Todas as rotas de veículos e locações exigem o header `Authorization: Bearer <token>`.
- O usuário da locação vem do token JWT, nunca do corpo da requisição. Cada usuário só consulta e finaliza as próprias locações.
- A devolução prevista deve ser posterior ao início, e o início não pode estar no passado.
- O valor total é calculado no backend: `diária × diárias`, contando qualquer fração de 24 horas como uma diária completa (2 dias e 1 hora = 3 diárias). A diária fica registrada na locação.
- Ao registrar a locação, o veículo é marcado como indisponível com um `updateMany` condicional (`available = true`) dentro de uma transação. Se duas requisições disputarem o mesmo veículo, apenas uma consegue atualizar e a outra recebe `409`.
- A finalização também usa `updateMany` condicional (`status = ACTIVE`) em transação: uma locação já finalizada não pode ser finalizada de novo, e o veículo volta a ficar disponível.
- Placas e e-mails são únicos. Não existe exclusão de veículos ou locações, preservando o histórico.
- A senha nunca é retornada pela API.

## Rodando localmente

Pré-requisitos: Node.js 20+ e um MySQL 8 (pode ser o do `docker compose up -d`).

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

A API fica disponível em `http://localhost:3333/api`.

Usuários criados pelo seed (senha `123456`):

- `maria@locadora.com`, que já tem uma locação finalizada no histórico
- `joao@locadora.com`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.

## Variáveis de ambiente

**backend/.env**

| Variável         | Descrição                                 |
| ---------------- | ----------------------------------------- |
| `DATABASE_URL`   | URL de conexão do MySQL                   |
| `JWT_SECRET`     | Chave usada para assinar os tokens        |
| `JWT_EXPIRES_IN` | Validade do token (padrão `1d`)           |
| `CORS_ORIGIN`    | Origens permitidas, separadas por vírgula |
| `PORT`           | Porta do servidor local (padrão `3333`)   |

**frontend/.env**

| Variável       | Descrição       |
| -------------- | --------------- |
| `VITE_API_URL` | URL base da API |

## Endpoints

Rotas marcadas com 🔒 exigem `Authorization: Bearer <token>`.

| Método | Rota                         | Descrição                                          | Sucesso |
| ------ | ---------------------------- | -------------------------------------------------- | ------- |
| GET    | `/api/health`                | Verifica se a API está no ar                       | 200     |
| POST   | `/api/auth/register`         | Cadastra um usuário e retorna o token              | 201     |
| POST   | `/api/auth/login`            | Autentica e retorna o token                        | 200     |
| GET    | `/api/auth/me` 🔒            | Dados do usuário autenticado                       | 200     |
| GET    | `/api/vehicles` 🔒           | Lista veículos (`available`, `category`, `search`) | 200     |
| GET    | `/api/vehicles/:id` 🔒       | Detalhes de um veículo                             | 200     |
| POST   | `/api/vehicles` 🔒           | Cadastra um veículo                                | 201     |
| GET    | `/api/rentals` 🔒            | Lista as locações do usuário (`status`)            | 200     |
| GET    | `/api/rentals/:id` 🔒        | Detalhes de uma locação do usuário                 | 200     |
| POST   | `/api/rentals` 🔒            | Registra uma locação                               | 201     |
| PATCH  | `/api/rentals/:id/finish` 🔒 | Finaliza a locação e registra a devolução          | 200     |

Códigos de erro: `401` (token ausente ou inválido), `404` (recurso inexistente ou de outro usuário), `409` (placa/e-mail duplicado, veículo indisponível ou locação já finalizada) e `422` (dados inválidos, com a lista `issues`). Todos os erros seguem o formato `{ "message": "..." }`.

Exemplos prontos estão em [`backend/requests.http`](backend/requests.http) (extensão REST Client do VS Code ou HTTP Client do IntelliJ).

## Deploy na Vercel

O repositório gera dois projetos na Vercel, um para cada pasta. É necessário um banco MySQL acessível pela internet (Aiven, Railway, TiDB Cloud etc.).

**API**

1. Crie as tabelas e os dados de exemplo no banco remoto, rodando localmente com a `DATABASE_URL` de produção:
   ```bash
   npm run db:deploy
   npm run db:seed
   ```
2. Importe o repositório na Vercel com **Root Directory** = `backend` (preset Other).
3. Configure `DATABASE_URL`, `JWT_SECRET` e `CORS_ORIGIN` (URL do frontend).
4. O Prisma Client é gerado no `postinstall` e todas as rotas são redirecionadas para `api/index.ts` pelo `vercel.json`.

**Frontend**

1. Importe o mesmo repositório com **Root Directory** = `frontend` (preset Vite).
2. Configure `VITE_API_URL` com a URL da API, por exemplo `https://sua-api.vercel.app/api`.
