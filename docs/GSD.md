# GSD - NBA Live Analytics Dashboard

## Visao Geral

O NBA Live Analytics Dashboard e um sistema fullstack para coletar, armazenar e visualizar estatisticas de jogadores, jogos e times de basquete.

## Objetivo

Demonstrar dominio de SQL, modelagem relacional, ETL Python, backend TypeScript, frontend React e visualizacao de dados.

## Problema

Dados esportivos costumam ficar espalhados entre APIs, arquivos e planilhas. O sistema centraliza esses dados em PostgreSQL e expõe dashboards para analise rapida.

## Publico-Alvo

- Recrutadores tecnicos.
- Analistas de dados iniciantes.
- Desenvolvedores backend/frontend.
- Pessoas estudando SQL aplicado.

## Atores

- Visitante: consulta dashboards, rankings e comparacoes.
- Desenvolvedor: roda migrations, seed, pipeline e evolui integracoes externas.
- Fonte de dados: mock provider no MVP e APIs externas no futuro.

## Casos de Uso

- Ver resumo da temporada.
- Consultar jogos e box score.
- Consultar perfil de jogador.
- Visualizar rankings de pontos, assistencias e rebotes.
- Comparar dois jogadores.
- Executar ETL com dados mockados.

## Fluxo Principal

1. Provider coleta dados mockados.
2. Pipeline transforma estatisticas.
3. Dados sao carregados no PostgreSQL.
4. Backend consulta dados via Prisma.
5. Frontend consome a API e renderiza dashboards.

## Arquitetura Geral

```text
[Mock/API NBA] -> [Python ETL] -> [PostgreSQL] -> [Express API] -> [React Dashboard]
```

## Tecnologias

React, TypeScript, Vite, Tailwind CSS, TanStack Query, TanStack Table, Recharts, Node.js, Express, Prisma, PostgreSQL, Python, Pandas e Docker.

## Requisitos Funcionais

- Listar times, jogadores e jogos.
- Exibir detalhe de jogo com estatisticas de jogadores.
- Exibir detalhe de jogador com medias e historico.
- Gerar rankings por pontos, assistencias e rebotes.
- Gerar analytics de eficiencia e impacto.
- Comparar dois jogadores.

## Requisitos Nao Funcionais

- Rodar localmente.
- Usar dados mockados sem API paga.
- Separar responsabilidades por camadas.
- Ter README e documentacao tecnica.
- Usar TypeScript no frontend e backend.
- Tratar divisao por zero nas metricas.

## Roadmap

- MVP com dados mockados.
- Integracao com API externa.
- Atualizacoes em tempo real por WebSocket.
- Testes automatizados.
- Dashboards por time e temporada.
