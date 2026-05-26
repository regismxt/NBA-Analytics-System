CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    external_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    city TEXT NOT NULL,
    conference TEXT NOT NULL,
    division TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    external_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    position TEXT NOT NULL,
    team_id INTEGER NOT NULL REFERENCES teams(id),
    height TEXT,
    weight INTEGER,
    birth_date TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    external_id TEXT UNIQUE NOT NULL,
    home_team_id INTEGER NOT NULL REFERENCES teams(id),
    away_team_id INTEGER NOT NULL REFERENCES teams(id),
    game_date TIMESTAMP NOT NULL,
    status TEXT NOT NULL,
    season TEXT NOT NULL,
    home_score INTEGER NOT NULL DEFAULT 0,
    away_score INTEGER NOT NULL DEFAULT 0,
    period INTEGER NOT NULL DEFAULT 0,
    clock TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player_game_stats (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    team_id INTEGER NOT NULL REFERENCES teams(id),
    minutes_played DOUBLE PRECISION NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0,
    rebounds INTEGER NOT NULL DEFAULT 0,
    assists INTEGER NOT NULL DEFAULT 0,
    steals INTEGER NOT NULL DEFAULT 0,
    blocks INTEGER NOT NULL DEFAULT 0,
    turnovers INTEGER NOT NULL DEFAULT 0,
    field_goals_made INTEGER NOT NULL DEFAULT 0,
    field_goals_attempted INTEGER NOT NULL DEFAULT 0,
    three_points_made INTEGER NOT NULL DEFAULT 0,
    three_points_attempted INTEGER NOT NULL DEFAULT 0,
    free_throws_made INTEGER NOT NULL DEFAULT 0,
    free_throws_attempted INTEGER NOT NULL DEFAULT 0,
    plus_minus INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (game_id, player_id)
);

CREATE TABLE live_events (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_description TEXT NOT NULL,
    period INTEGER NOT NULL,
    clock TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_snapshots (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    impact_score DOUBLE PRECISION NOT NULL,
    fantasy_score DOUBLE PRECISION NOT NULL,
    usage_rate DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (game_id, player_id)
);
