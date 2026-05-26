-- 1. Top 10 pontuadores
SELECT p.full_name, t.abbreviation AS team, SUM(pgs.points) AS total_points
FROM player_game_stats pgs
JOIN players p ON p.id = pgs.player_id
JOIN teams t ON t.id = pgs.team_id
GROUP BY p.full_name, t.abbreviation
ORDER BY total_points DESC
LIMIT 10;

-- 2. Top 10 assistentes
SELECT p.full_name, t.abbreviation AS team, SUM(pgs.assists) AS total_assists
FROM player_game_stats pgs
JOIN players p ON p.id = pgs.player_id
JOIN teams t ON t.id = pgs.team_id
GROUP BY p.full_name, t.abbreviation
ORDER BY total_assists DESC
LIMIT 10;

-- 3. Top 10 reboteiros
SELECT p.full_name, t.abbreviation AS team, SUM(pgs.rebounds) AS total_rebounds
FROM player_game_stats pgs
JOIN players p ON p.id = pgs.player_id
JOIN teams t ON t.id = pgs.team_id
GROUP BY p.full_name, t.abbreviation
ORDER BY total_rebounds DESC
LIMIT 10;

-- 4. Jogadores mais eficientes
SELECT
    p.full_name,
    t.abbreviation AS team,
    SUM(pgs.points + pgs.rebounds + pgs.assists + pgs.steals + pgs.blocks - pgs.turnovers) AS total_efficiency
FROM player_game_stats pgs
JOIN players p ON p.id = pgs.player_id
JOIN teams t ON t.id = pgs.team_id
GROUP BY p.full_name, t.abbreviation
ORDER BY total_efficiency DESC
LIMIT 10;

-- 5. Media de pontos por jogador
SELECT p.full_name, ROUND(AVG(pgs.points), 2) AS avg_points
FROM player_game_stats pgs
JOIN players p ON p.id = pgs.player_id
GROUP BY p.full_name
ORDER BY avg_points DESC;

-- 6. Estatisticas por time
SELECT
    t.abbreviation AS team,
    SUM(pgs.points) AS total_points,
    ROUND(AVG(pgs.rebounds), 2) AS avg_rebounds,
    ROUND(AVG(pgs.assists), 2) AS avg_assists
FROM player_game_stats pgs
JOIN teams t ON t.id = pgs.team_id
GROUP BY t.abbreviation
ORDER BY total_points DESC;

-- 7. Estatisticas de um jogador nos ultimos jogos
SELECT g.game_date, p.full_name, pgs.points, pgs.rebounds, pgs.assists
FROM player_game_stats pgs
JOIN players p ON p.id = pgs.player_id
JOIN games g ON g.id = pgs.game_id
WHERE p.id = :player_id
ORDER BY g.game_date DESC
LIMIT 5;

-- 8. Comparacao entre dois jogadores
SELECT
    p.full_name,
    ROUND(AVG(pgs.points), 2) AS avg_points,
    ROUND(AVG(pgs.rebounds), 2) AS avg_rebounds,
    ROUND(AVG(pgs.assists), 2) AS avg_assists,
    ROUND(AVG(pgs.points + pgs.rebounds + pgs.assists + pgs.steals + pgs.blocks - pgs.turnovers), 2) AS avg_efficiency
FROM player_game_stats pgs
JOIN players p ON p.id = pgs.player_id
WHERE p.id IN (:player_a_id, :player_b_id)
GROUP BY p.full_name;

-- 9. Jogadores com maior aproveitamento de arremessos
SELECT
    p.full_name,
    t.abbreviation AS team,
    ROUND(SUM(pgs.field_goals_made)::numeric / NULLIF(SUM(pgs.field_goals_attempted), 0) * 100, 2) AS fg_percentage
FROM player_game_stats pgs
JOIN players p ON p.id = pgs.player_id
JOIN teams t ON t.id = pgs.team_id
GROUP BY p.full_name, t.abbreviation
HAVING SUM(pgs.field_goals_attempted) > 0
ORDER BY fg_percentage DESC
LIMIT 10;

-- 10. Jogos com maior pontuacao total
SELECT
    g.id,
    away.abbreviation AS away_team,
    home.abbreviation AS home_team,
    g.away_score,
    g.home_score,
    (g.away_score + g.home_score) AS total_score
FROM games g
JOIN teams away ON away.id = g.away_team_id
JOIN teams home ON home.id = g.home_team_id
ORDER BY total_score DESC
LIMIT 10;
