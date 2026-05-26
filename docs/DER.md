# DER

## Entidades

### Team

Chave primaria: `id`

Chave unica: `external_id`

Campos: nome, abreviacao, cidade, conferencia e divisao.

### Player

Chave primaria: `id`

Chave unica: `external_id`

Chave estrangeira: `team_id -> teams.id`

Cada jogador pertence a um time.

### Game

Chave primaria: `id`

Chave unica: `external_id`

Chaves estrangeiras:

- `home_team_id -> teams.id`
- `away_team_id -> teams.id`

Cada jogo possui um time mandante e um visitante.

### PlayerGameStat

Chave primaria: `id`

Chaves estrangeiras:

- `game_id -> games.id`
- `player_id -> players.id`
- `team_id -> teams.id`

Restricao unica: um jogador tem uma linha por jogo (`game_id`, `player_id`).

### LiveEvent

Chave primaria: `id`

Chaves estrangeiras:

- `game_id -> games.id`
- `player_id -> players.id`, opcional.

Representa eventos narrativos ou de play-by-play.

### AnalyticsSnapshot

Chave primaria: `id`

Chaves estrangeiras:

- `game_id -> games.id`
- `player_id -> players.id`

Armazena metricas derivadas como impacto, fantasy score e usage rate.

## Cardinalidades

- `Team 1:N Player`
- `Team 1:N Game` como mandante
- `Team 1:N Game` como visitante
- `Game 1:N PlayerGameStat`
- `Player 1:N PlayerGameStat`
- `Game 1:N LiveEvent`
- `Player 0:N LiveEvent`
- `Game 1:N AnalyticsSnapshot`
- `Player 1:N AnalyticsSnapshot`

## Diagrama Textual

```text
teams
  1 ---- N players
  1 ---- N games.home_team_id
  1 ---- N games.away_team_id

games
  1 ---- N player_game_stats
  1 ---- N live_events
  1 ---- N analytics_snapshots

players
  1 ---- N player_game_stats
  0 ---- N live_events
  1 ---- N analytics_snapshots
```
