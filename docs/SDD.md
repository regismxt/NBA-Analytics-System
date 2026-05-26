# SDD - NBA Live Analytics Dashboard

## Introducao

Este documento descreve a solucao tecnica do NBA Live Analytics Dashboard.

## Escopo

O MVP cobre banco PostgreSQL, API REST, dashboard React, seed de dados mockados, pipeline Python e SQL analitico.

## Arquitetura Tecnica

```text
frontend/       React + Vite + Tailwind
backend/        Express + Prisma + PostgreSQL
data-pipeline/  Python + Pandas + provider mockado
database/       SQL, views e queries analiticas
docs/           Documentacao de sistema
```

## Camadas

- Coleta: `NbaDataProvider` e `MockNbaDataProvider`.
- Transformacao: calculo de eficiencia, impacto e percentuais.
- Persistencia: PostgreSQL com Prisma.
- API: controllers, routes, services e repositories.
- UI: paginas, hooks, services e componentes.

## Modelagem do Banco

Entidades principais:

- `teams`
- `players`
- `games`
- `player_game_stats`
- `live_events`
- `analytics_snapshots`

Relacionamentos:

- Um time tem muitos jogadores.
- Um jogo tem um time mandante e um visitante.
- Um jogo tem muitas linhas de estatistica.
- Um jogador tem muitas linhas de estatistica.

## Endpoints da API

- `GET /api/health`
- `GET /api/teams`
- `GET /api/teams/:id`
- `GET /api/players`
- `GET /api/players/:id`
- `GET /api/games`
- `GET /api/games/live`
- `GET /api/games/:id`
- `GET /api/games/:id/player-stats`
- `GET /api/rankings/points`
- `GET /api/rankings/assists`
- `GET /api/rankings/rebounds`
- `GET /api/analytics/summary`
- `GET /api/analytics/top-performers`
- `GET /api/analytics/player-comparison`

## Padroes de Codigo

- TypeScript estrito.
- Controllers finos.
- Services para regra de negocio.
- Repositories para acesso ao Prisma.
- Componentes React reutilizaveis.

## Tratamento de Erros

Erros conhecidos usam `ApiError` com status HTTP. Erros inesperados retornam `500` com stack apenas fora de producao.

## Logs

O MVP usa logs simples no startup e no seed. Uma evolucao natural e adicionar `pino` ou `winston`.

## Testes

Estrategia recomendada:

- Unitarios para metricas.
- Integracao para endpoints.
- Smoke tests para carregamento do frontend.

## Decisoes Tecnicas

- Prisma foi escolhido para produtividade e migrations.
- Rankings sao agregados no backend para manter a UI simples.
- Dados mockados garantem execucao local sem API paga.
- Views SQL documentam consultas analiticas reutilizaveis.

## Limitacoes Conhecidas

- Sem WebSocket no MVP.
- Sem autenticacao.
- Provider externo ainda nao implementado.
- Pipeline e seed possuem fontes mockadas semelhantes, mas independentes.
