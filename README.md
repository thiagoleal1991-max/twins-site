# Twins Artigos Personalizados — Site + Catálogo

Site institucional da Twins, com catálogo de produtos sincronizado
periodicamente da API da XBZ Brindes (fornecedor).

> 🚧 **Status:** arquitetura de backend (banco de dados, sincronização,
> catálogo) implementada. O **design final ainda não foi aplicado** — as
> páginas atuais são propositalmente simples, só para validar a lógica.
> O protótipo visual da marca está em `reference/twins-site-prototipo.html`
> e vai ser convertido em componentes quando estiver pronto.
>
> Este trabalho está na branch `feature/catalogo-xbz` — a `main` continua
> servindo o site estático original, no ar em produção, sem mudanças.

## Stack

- **Next.js** (App Router, TypeScript) — páginas + rotas de API no mesmo projeto
- **Postgres** (Vercel Postgres / Neon) via **Prisma** — banco de dados do catálogo
- **Vercel Cron** — sincronização semanal com a API da XBZ

## Por que essa arquitetura

A API da XBZ tem limite de **24 acessos/dia, compartilhado com o ERP da
Twins** — o site nunca pode chamá-la a cada visita. Em vez disso:

1. Uma rotina agendada (`/api/sync/xbz`, 1x por semana) busca o catálogo
   completo da XBZ e grava/atualiza no banco Postgres local.
2. O site (catálogo, busca, categorias, paginação) sempre lê **só do banco
   local** — nunca da XBZ em tempo real.
3. A XBZ não retorna preço na listagem (só na hora de fechar um pedido) —
   então não exibimos preço fixo. O fluxo é "Solicitar orçamento": o
   visitante monta uma lista de produtos, preenche os dados de contato, e
   isso vira um `QuoteRequest` no banco + uma mensagem pronta pro WhatsApp da
   Twins. Isso é **diferente** de criar um pedido real na XBZ (endpoint
   `PedidoEnviar`) — o pedido efetivo continua sendo fechado manualmente
   pelo time da Twins.
4. Categoria não vem da XBZ — é inferida por palavra-chave na descrição do
   produto (`src/lib/categorize.ts`), ajustável a qualquer momento.

## Estrutura

```
prisma/schema.prisma          → modelos: Product, QuoteRequest, QuoteRequestItem, SyncLog
src/lib/xbz.ts                → cliente da API da XBZ (headers cnpj/token)
src/lib/sync.ts                → lógica de sincronização (upsert + desativação)
src/lib/categorize.ts          → categorização automática por palavra-chave
src/lib/products.ts            → busca/filtro/paginação do catálogo local
src/lib/cart-context.tsx       → "carrinho" de orçamento (localStorage)
src/app/api/sync/xbz/route.ts  → rota chamada pelo cron semanal (autenticada)
src/app/api/products/route.ts  → API JSON do catálogo
src/app/api/quote/route.ts     → cria um pedido de orçamento
src/app/catalogo/               → página de listagem (busca/categoria/paginação)
src/app/produto/[codigo]/       → página de detalhe do produto
src/app/orcamento/              → carrinho + formulário de contato
scripts/sync-xbz.ts             → roda a sincronização manualmente (fora do cron)
reference/                      → protótipo visual original (referência de design)
```

## Rodando localmente

1. `npm install`
2. Copie `.env.example` para `.env` (o `.env` real com os valores já existe
   neste ambiente de trabalho — só falta o `DATABASE_URL`)
3. Crie um banco Postgres (veja abaixo) e preencha `DATABASE_URL` no `.env`
4. `npm run prisma:migrate` — cria as tabelas
5. `npm run sync:xbz` — faz a primeira sincronização com a XBZ (⚠️ consome 1
   das 24 chamadas diárias — rode com moderação)
6. `npm run dev` — abre em `http://localhost:3000`

## Criando o banco de dados (Vercel Postgres)

1. No dashboard da Vercel, dentro do projeto → aba **Storage** → **Create
   Database** → **Postgres**.
2. Depois de criado, a Vercel oferece pra "conectar" ao projeto — isso
   preenche `DATABASE_URL` automaticamente nas variáveis de ambiente do
   deploy (Production/Preview/Development).
3. Para rodar migrations localmente, copie a connection string mostrada lá
   pro seu `.env`.

## Variáveis de ambiente necessárias na Vercel

Configurar em **Settings → Environment Variables**:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | preenchida automaticamente ao conectar o Postgres |
| `XBZ_CNPJ` | `42816253000188` |
| `XBZ_TOKEN` | (o token da XBZ — não expor em nenhum lugar público) |
| `XBZ_BASE_URL` | `https://api.minhaxbz.com.br:5001/api/clientes` |
| `CRON_SECRET` | uma string aleatória — o Vercel Cron já envia isso automaticamente no header `Authorization` |

## ⚠️ Antes de ativar o cron em produção

A sincronização assume que `GET /ProdutosListar` **sem** o parâmetro `busca`
retorna o catálogo completo (a documentação da XBZ não deixa 100% explícito
se existe paginação). Isso ainda não foi validado contra a API real. Antes
de deixar o cron semanal ligado sem supervisão, recomendo rodar
`npm run sync:xbz` manualmente uma vez e conferir:

- Quantos produtos vieram (`totalFetched` no resultado)
- Se bate com a expectativa de "+5 mil itens" do catálogo da Twins
- Se não veio truncado/paginado silenciosamente

## Domínio e deploy

Domínio: `twinsartigospersonalizados.com.br` (Registro.br → DNS já
apontado para a Vercel). Ver histórico de configuração de DNS nas
conversas anteriores deste projeto.
