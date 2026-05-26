CREATE OR REPLACE VIEW vw_player_performance AS
SELECT
    p.id AS player_id,
    p.full_name,
    t.abbreviation AS team,
    COUNT(pgs.game_id) AS games_played,
    ROUND(AVG(pgs.points), 2) AS avg_points,
    ROUND(AVG(pgs.rebounds), 2) AS avg_rebounds,
    ROUND(AVG(pgs.assists), 2) AS avg_assists,
    ROUND(AVG(pgs.steals), 2) AS avg_steals,
    ROUND(AVG(pgs.blocks), 2) AS avg_blocks,
    ROUND(AVG(pgs.turnovers), 2) AS avg_turnovers,
    ROUND(AVG(pgs.points + pgs.rebounds + pgs.assists + pgs.steals + pgs.blocks - pgs.turnovers), 2) AS avg_efficiency,
    ROUND(AVG(pgs.points + (pgs.rebounds * 1.2) + (pgs.assists * 1.5) + (pgs.steals * 2) + (pgs.blocks * 2) - (pgs.turnovers * 1.3)), 2) AS avg_impact_score
FROM player_game_stats pgs
JOIN players p ON p.id = pgs.player_id
JOIN teams t ON t.id = pgs.team_id
GROUP BY p.id, p.full_name, t.abbreviation;

CREATE OR REPLACE VIEW vw_top_scorers AS
SELECT
    p.id AS player_id,
    p.full_name,
    t.abbreviation AS team,
    SUM(pgs.points) AS total_points,
    ROUND(AVG(pgs.points), 2) AS avg_points
FROM player_game_stats pgs
JOIN players p ON p.id = pgs.player_id
JOIN teams t ON t.id = pgs.team_id
GROUP BY p.id, p.full_name, t.abbreviation
ORDER BY total_points DESC;

CREATE OR REPLACE VIEW vw_team_stats AS
SELECT
    t.id AS team_id,
    t.abbreviation,
    t.city,
    t.name,
    COUNT(DISTINCT pgs.game_id) AS games_played,
    SUM(pgs.points) AS total_points,
    ROUND(AVG(pgs.points), 2) AS avg_player_points,
    ROUND(AVG(pgs.rebounds), 2) AS avg_player_rebounds,
    ROUND(AVG(pgs.assists), 2) AS avg_player_assists
FROM teams t
LEFT JOIN player_game_stats pgs ON pgs.team_id = t.id
GROUP BY t.id, t.abbreviation, t.city, t.name;

CREATE OR REPLACE VIEW vw_game_box_scores AS
SELECT
    g.id AS game_id,
    g.game_date,
    home.abbreviation AS home_team,
    away.abbreviation AS away_team,
    g.home_score,
    g.away_score,
    p.full_name,
    t.abbreviation AS stat_team,
    pgs.points,
    pgs.rebounds,
    pgs.assists,
    pgs.steals,
    pgs.blocks,
    pgs.turnovers
FROM games g
JOIN teams home ON home.id = g.home_team_id
JOIN teams away ON away.id = g.away_team_id
JOIN player_game_stats pgs ON pgs.game_id = g.id
JOIN players p ON p.id = pgs.player_id
JOIN teams t ON t.id = pgs.team_id;
