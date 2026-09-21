# Bibliotech API

API RESTful para gestão de uma biblioteca: cadastro de clientes, catálogo de obras,
controle de exemplares físicos e empréstimos (com regras de negócio de disponibilidade,
devolução e cancelamento).

## Tecnologias

- Node.js + TypeScript
- Express
- Prisma ORM + SQLite (`better-sqlite3`)
- JWT (`jsonwebtoken`) para autenticação
- `bcryptjs` para hash de senha
- Swagger (`swagger-jsdoc` + `swagger-ui-express`) para documentação interativa

## Estrutura do domínio

- **Cliente** — usuário que faz login e realiza empréstimos.
- **Obra** — um título (livro), ex: "Dom Casmurro".
- **Exemplar** — uma cópia física de uma obra, com `statusDisponibilidade`
  (`Disponivel` / `Emprestado`).
- **Empréstimo** — relação entre um cliente e um exemplar, com `statusContrato`
  (`Ativo` / `Finalizado` / `Cancelado`).

## Pré-requisitos

- Node.js instalado
- Um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="uma_chave_secreta_qualquer"
JWT_EXPIRES_IN="1d"
```

## Instalação e primeira execução

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

O servidor sobe em `http://localhost:3333`.

> Se rodar `npx prisma db seed` mais de uma vez, vai dar erro de campo único
> duplicado (matrícula/ISBN/código de exemplar). Para recomeçar do zero, apague
> `prisma/dev.db` e rode `npx prisma migrate dev` + `npx prisma db seed` de novo.

## Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor em modo desenvolvimento (recarrega sozinho) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Roda a versão compilada (`dist/server.js`) |
| `npm run seed` | Popula o banco com dados de exemplo |
| `npm run prisma:studio` | Abre o Prisma Studio (interface visual do banco) |

## Endpoints principais

| Método | Rota | Protegida? | Descrição |
|---|---|---|---|
| POST | `/api/cliente` | Não | Cadastra um cliente |
| GET | `/api/cliente` | Sim | Lista clientes |
| GET | `/api/cliente/:id` | Sim | Busca cliente por id |
| POST | `/api/auth/login` | Não | Login, devolve token JWT |
| GET | `/api/obra` | Não | Lista obras |
| GET | `/api/obra/:id` | Não | Busca obra por id |
| POST | `/api/obra` | Sim | Cadastra obra |
| PUT | `/api/obra/:id` | Sim | Atualiza obra |
| GET | `/api/exemplar` | Não | Lista exemplares |
| GET | `/api/exemplar/:id` | Não | Busca exemplar por id |
| POST | `/api/exemplar` | Sim | Cadastra exemplar para uma obra |
| POST | `/api/emprestimo` | Sim | Abre um empréstimo (RN01) |
| GET | `/api/emprestimo` | Sim | Lista empréstimos do cliente autenticado |
| GET | `/api/emprestimo/:id` | Sim | Busca empréstimo por id |
| PATCH | `/api/emprestimo/:id/devolver` | Sim | Devolve o exemplar (RN02) |
| PATCH | `/api/emprestimo/:id/cancelar` | Sim | Cancela o empréstimo |

Rotas protegidas exigem o header `Authorization: Bearer <token>`, obtido em `/api/auth/login`.

## Testando pelo terminal insomnia (curl)

```bash
# 1. Criar cliente
curl -X POST http://localhost:3333/api/cliente \
  -H "Content-Type: application/json" \
  -d '{"nome":"Cliente Teste","matricula":"2026099","email":"cliente@teste.com","senha":"123456","telefone":"11999999999"}'

# 2. Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@teste.com","senha":"123456"}'

# 3. Rota protegida (troque $TOKEN pelo token do passo 2)
TOKEN="cole_aqui_o_token"
curl -i http://localhost:3333/api/cliente                                   # -> 401
curl http://localhost:3333/api/cliente -H "Authorization: Bearer $TOKEN"    # -> 200

# 4. Catálogo (rota pública)
curl http://localhost:3333/api/obra
curl http://localhost:3333/api/exemplar

# 5. Abrir empréstimo (use um exemplarId "Disponivel" do seed, ex: 1)
curl -X POST http://localhost:3333/api/emprestimo \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"exemplarId":1,"dataPrevistaDevolucao":"2026-09-30T12:00:00.000Z"}'

# 6. Tentar de novo, mesmo exemplar -> 400 (RN01)
curl -i -X POST http://localhost:3333/api/emprestimo \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"exemplarId":1,"dataPrevistaDevolucao":"2026-09-30T12:00:00.000Z"}'

# 7. Devolver (troque "1" pelo id do empréstimo criado no passo 5)
curl -X PATCH http://localhost:3333/api/emprestimo/1/devolver -H "Authorization: Bearer $TOKEN"
```

**Checkpoints esperados:**
- Passo 1: cliente criado, sem o campo `senha` na resposta.
- Passo 2: `{ "token": "...", "cliente": {...} }`.
- Passo 3: `401` sem token, `200` com token válido.
- Passo 6: `{"erro":"Este exemplar não está disponível para empréstimo no momento."}`.
- Passo 7: o exemplar volta a aparecer com `statusDisponibilidade: "Disponivel"` em `GET /api/exemplar`.

## Documentação interativa (Swagger)

Com o servidor rodando, acesse:

- **`http://localhost:3333/api-docs`** — interface visual (Swagger UI), navegável no navegador.
- **`http://localhost:3333/api-docs.json`** — o documento OpenAPI em JSON puro.

### Roteiro de demonstração 100% pelo navegador

1. `POST /api/cliente` → **Try it out** → cria um cliente novo.
2. `POST /api/auth/login` → copie o `token` da resposta → clique em **Authorize**,
   cole o token e confirme.
3. `GET /api/exemplar` → escolha um `exemplarId` com `statusDisponibilidade: "Disponivel"`.
4. `POST /api/emprestimo` com esse `exemplarId` → deve retornar `201`, e o exemplar
   passa a `Emprestado`.
5. `POST /api/emprestimo` de novo, mesmo `exemplarId` → `400`, com a mensagem de
   indisponibilidade (RN01) exatamente como documentada.
6. `PATCH /api/emprestimo/{id}/devolver` (use o `emprestimoId` retornado no passo 4,
   não o `exemplarId`) → `200`, exemplar volta a `Disponivel`.

### Exportando a coleção para Insomnia/Postman

O endpoint `GET /api-docs.json` expõe o documento OpenAPI completo.

- **Insomnia:** Create → Import → URL → `http://localhost:3333/api-docs.json`
- **Postman:** Import → Link → mesma URL

Isso gera uma coleção pronta com todas as rotas documentadas.

### Documentação em produção

O campo `apis` em `src/config/swagger.ts` varre tanto `src/routes/*.ts` (desenvolvimento)
quanto `dist/routes/*.js` (produção):

```ts
apis: ['./src/routes/*.ts', './dist/routes/*.js'],
```

O `tsc` preserva os comentários `@openapi` no JavaScript compilado — depois de
`npm run build`, os blocos continuam presentes em `dist/routes/*.js`, então
`npm start` serve exatamente a mesma documentação.

## Regras de negócio implementadas

- **RN01** — um exemplar só pode ser emprestado se `statusDisponibilidade === "Disponivel"`.
- **RN02** — ao devolver, o exemplar volta a `Disponivel` e o empréstimo passa a `Finalizado`.
- Um cliente só pode ver, devolver ou cancelar **seus próprios** empréstimos (`403` caso contrário).
- Não é possível devolver ou cancelar um empréstimo que não esteja `Ativo`.