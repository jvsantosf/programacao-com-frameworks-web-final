# Sistema de Locação de Veículos

Projeto da disciplina **Programação com Frameworks Web** (UNIPÊ). Sistema web para cadastro e login de usuários, cadastro e consulta de veículos, registro de locações e devoluções.

## Tecnologias

| Camada   | Stack                                                       |
| -------- | ----------------------------------------------------------- |
| Backend  | Node.js, Express 5, TypeScript, Prisma ORM, MySQL, JWT, Zod |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, React Router    |
| Deploy   | Vercel (API como Serverless Function + SPA estática)        |

## Estrutura

```
.
├── backend
│   ├── api/index.ts            entrada da Serverless Function (Vercel)
│   ├── prisma/                 schema, migrations e seed
│   ├── requests.http           coleção de requisições para testar a API
│   └── src
│       ├── app.ts              configuração do Express e rotas
│       ├── server.ts           servidor local
│       ├── config/             variáveis de ambiente
│       ├── lib/                Prisma Client, JWT e utilitários
│       ├── middlewares/        autenticação, autorização e tratamento de erros
│       └── modules/            auth, vehicles e rentals (routes → controller → service)
├── frontend
│   └── src
│       ├── components/         layout, guarda de rotas e componentes de UI
│       ├── contexts/           contexto de autenticação
│       ├── lib/                cliente HTTP e formatações
│       └── pages/              telas da aplicação
└── docker-compose.yml          MySQL para desenvolvimento local
```

## Modelo de dados

- **User**: nome, e-mail (único), senha (hash bcrypt) e perfil (`ADMIN` ou `CUSTOMER`).
- **Vehicle**: marca, modelo, ano, placa (única), cor, categoria, valor da diária, status (`AVAILABLE`, `RENTED`, `MAINTENANCE`) e imagem opcional.
- **Rental**: usuário, veículo, data de retirada, devolução prevista, data de devolução, diária, valor estimado, valor final e status (`ACTIVE`, `RETURNED`).

## Regras de negócio

- Novos cadastros recebem o perfil `CUSTOMER`. O administrador é criado pelo seed.
- Apenas administradores cadastram, editam e excluem veículos. A consulta é pública.
- A placa aceita os padrões antigo (`ABC1234`) e Mercosul (`ABC1D23`).
- Só é possível alugar veículos com status `AVAILABLE`. Ao alugar, o veículo passa para `RENTED` dentro de uma transação, evitando duas locações simultâneas do mesmo carro.
- A retirada não pode ser no passado e a devolução prevista deve ser posterior à retirada.
- O valor da diária é registrado na locação, então alterações futuras no preço do veículo não afetam locações existentes.
- Na devolução, o valor final é calculado pelos dias efetivamente utilizados (mínimo de 1 diária) e o veículo volta a ficar disponível.
- Veículos locados não podem ter o status alterado nem ser excluídos. Veículos com histórico de locações também não podem ser excluídos.
- Clientes veem apenas as próprias locações. Administradores veem todas e podem registrar qualquer devolução.

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

Usuário administrador criado pelo seed:

- E-mail: `admin@locadora.com`
- Senha: `admin123`

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

| Variável         | Descrição                                       |
| ---------------- | ----------------------------------------------- |
| `DATABASE_URL`   | URL de conexão do MySQL                         |
| `JWT_SECRET`     | Chave usada para assinar os tokens              |
| `JWT_EXPIRES_IN` | Validade do token (padrão `1d`)                 |
| `CORS_ORIGIN`    | Origens permitidas, separadas por vírgula       |
| `PORT`           | Porta do servidor local (padrão `3333`)         |

**frontend/.env**

| Variável       | Descrição            |
| -------------- | -------------------- |
| `VITE_API_URL` | URL base da API      |

## Endpoints

Rotas marcadas com 🔒 exigem o header `Authorization: Bearer <token>`. Rotas com 👑 exigem perfil `ADMIN`.

| Método | Rota                       | Descrição                                       |
| ------ | -------------------------- | ----------------------------------------------- |
| GET    | `/api/health`              | Verifica se a API está no ar                    |
| POST   | `/api/auth/register`       | Cadastra um usuário e retorna o token           |
| POST   | `/api/auth/login`          | Autentica e retorna o token                     |
| GET    | `/api/auth/me` 🔒          | Dados do usuário autenticado                    |
| GET    | `/api/vehicles`            | Lista veículos (`search`, `category`, `status`) |
| GET    | `/api/vehicles/:id`        | Detalhes de um veículo                          |
| POST   | `/api/vehicles` 🔒👑       | Cadastra um veículo                             |
| PUT    | `/api/vehicles/:id` 🔒👑   | Atualiza um veículo                             |
| DELETE | `/api/vehicles/:id` 🔒👑   | Exclui um veículo                               |
| GET    | `/api/rentals` 🔒          | Lista locações (`status`)                       |
| GET    | `/api/rentals/:id` 🔒      | Detalhes de uma locação                         |
| POST   | `/api/rentals` 🔒          | Registra uma locação                            |
| PATCH  | `/api/rentals/:id/return` 🔒 | Registra a devolução                          |

Exemplos prontos de requisição estão em [`backend/requests.http`](backend/requests.http) (extensão REST Client do VS Code ou HTTP Client do IntelliJ).

Erros seguem o formato `{ "message": "..." }`. Erros de validação retornam status `422` com a lista `issues`.

## Deploy na Vercel

O repositório gera dois projetos na Vercel, um para cada pasta. É necessário um banco MySQL acessível pela internet (Aiven, Railway, TiDB Cloud etc.).

**API**

1. Crie as tabelas e o administrador no banco remoto, rodando localmente com a `DATABASE_URL` de produção:
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
