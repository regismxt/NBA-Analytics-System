# API

Base URL local: `http://localhost:4000/api`

## Health

`GET /health`

Retorna status da API.

```json
{"status":"ok","service":"nba-live-analytics-api","timestamp":"2026-05-21T12:00:00.000Z"}
```

## Teams

`GET /teams`

Lista times.

`GET /teams/:id`

Retorna um time com jogadores e jogos.

## Players

`GET /players`

Parametros:

- `search`: busca por nome ou posicao.
- `teamId`: filtra por time.

`GET /players/:id`

Retorna jogador, time, medias e historico.

## Games

`GET /games`

Parametro opcional:

- `status`: `FINAL`, `LIVE` ou `SCHEDULED`.

`GET /games/live`

Lista jogos ao vivo.

`GET /games/:id`

Retorna detalhe do jogo.

`GET /games/:id/player-stats`

Retorna box score dos jogadores.

## Rankings

`GET /rankings/points`

`GET /rankings/assists`

`GET /rankings/rebounds`

Parametro opcional:

- `limit`: quantidade de linhas. Padrao: `10`.

Exemplo:

```json
[
  {
    "playerId": 1,
    "fullName": "Mason Reed",
    "position": "PG",
    "team": "ATL",
    "gamesPlayed": 2,
    "total": 48,
    "average": 24
  }
]
```

## Analytics

`GET /analytics/summary`

Retorna totais, jogos recentes e top pontuadores para a home.

`GET /analytics/top-performers`

Retorna rankings de pontos, assistencias, rebotes, eficiencia e impacto.

`GET /analytics/player-comparison?playerAId=1&playerBId=2`

Compara dois jogadores.

Exemplo:

```json
{
  "playerA": {
    "gamesPlayed": 2,
    "averages": {
      "points": 24,
      "rebounds": 5,
      "assists": 9,
      "efficiency": 37,
      "impactScore": 42.1
    }
  },
  "playerB": {
    "gamesPlayed": 2,
    "averages": {
      "points": 20,
      "rebounds": 8,
      "assists": 4,
      "efficiency": 31,
      "impactScore": 34.7
    }
  }
}
```
