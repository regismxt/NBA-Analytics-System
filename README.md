# CourtVision Analytics

> Fundação fullstack para análise de dados da NBA. A Fase 1 de estabilização está pronta para revisão.

## Status técnico

O seed de dados demonstrativos é opt-in, não executa exclusões globais e grava a carga em uma transação serializada. Para carregar o mock localmente, defina `SEED_MODE=demo` antes de `npm run db:seed`.

No PowerShell:

```powershell
$env:SEED_MODE = "demo"
npm run db:seed
```

No Bash:

```bash
SEED_MODE=demo npm run db:seed
```

Os resultados verificados e as limitações atuais estão em [`docs/TECHNICAL_AUDIT.md`](docs/TECHNICAL_AUDIT.md). O roadmap de estabilização está em [`docs/ROADMAP.md`](docs/ROADMAP.md).

Sistema fullstack para analise de estatisticas da NBA com PostgreSQL, Prisma, Express, React, dashboards e pipeline Python de dados mockados.

## Tecnologias

- Frontend: React, TypeScript, Vite, Tailwind CSS, TanStack Query, TanStack Table, Recharts.
- Backend: Node.js, TypeScript, Express, Prisma ORM, Zod.
- Banco: PostgreSQL, Prisma migrations, views SQL e queries analiticas.
- Dados: Python, Pandas, Requests, mock provider e loader para PostgreSQL.
- Infra: Docker, Docker Compose e variaveis por `.env`.

## Funcionalidades

- Dashboard com total de jogos, jogadores, maior pontuador e maior eficiencia.
- Listagem e detalhe de jogos, jogadores e times.
- Rankings de pontos, assistencias e rebotes.
- Pagina de analytics com graficos e tabela filtravel.
- Comparacao entre dois jogadores consumindo a API real.
- Seed com 6 times, 30 jogadores, 6 jogos e estatisticas por jogo.

## Como rodar localmente

1. Instale dependencias:

```bash
npm install
```

2. Copie as variaveis:

```bash
cp .env.example .env
```

3. Suba o PostgreSQL:

```bash
docker compose up -d postgres
```

4. Execute migrations e, opcionalmente, o seed demonstrativo:

```bash
npm run db:migrate
SEED_MODE=demo npm run db:seed
```

5. Rode backend e frontend:

```bash
npm run dev
```

Backend: `http://localhost:4000/api`

Frontend: `http://localhost:5173`

## Como rodar com Docker

```bash
docker compose up --build
```

O backend aplica migrations, roda o seed e sobe a API. O frontend fica disponivel em `http://localhost:5173`.

## Migrations e seed

```bash
npm run db:migrate
SEED_MODE=demo npm run db:seed
```

Tambem e possivel rodar diretamente no workspace:

```bash
npm --workspace backend run prisma:migrate
SEED_MODE=demo npm --workspace backend run seed
```

Sem `SEED_MODE=demo`, o comando de seed encerra sem abrir uma carga ou modificar dados.

## Verificações

```bash
npm run typecheck
npm run build
npm --workspace backend test
```

O frontend ainda não possui suíte própria de testes automatizados. O build pode emitir um alerta não bloqueante para o bundle principal acima de 500 kB.

## Pipeline Python

Instale as dependencias em um ambiente Python:

```bash
pip install -r data-pipeline/requirements.txt
```

Coleta e transformacao local:

```bash
python data-pipeline/collectors/nba_collector.py
python data-pipeline/transformers/transform_stats.py
```

Carga no PostgreSQL:

```bash
python data-pipeline/loaders/load_to_postgres.py
```

## Prints

Inclua aqui prints do dashboard principal, pagina de jogo, pagina de jogador, analytics e comparacao.

## Roadmap

- Integrar `nba_api` ou BALLDONTLIE.
- Adicionar WebSocket para eventos ao vivo.
- Criar alertas de performance.
- Expandir testes automatizados.
- Adicionar autenticacao para areas administrativas.

## Autor

Mateus Régis

GitHub: https://github.com/regismxt

LinkedIn: https://www.linkedin.com/in/mateusregis/
