CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "team_id" INTEGER NOT NULL,
    "height" TEXT,
    "weight" INTEGER,
    "birth_date" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "home_team_id" INTEGER NOT NULL,
    "away_team_id" INTEGER NOT NULL,
    "game_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "home_score" INTEGER NOT NULL DEFAULT 0,
    "away_score" INTEGER NOT NULL DEFAULT 0,
    "period" INTEGER NOT NULL DEFAULT 0,
    "clock" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "player_game_stats" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "minutes_played" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rebounds" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "steals" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL DEFAULT 0,
    "turnovers" INTEGER NOT NULL DEFAULT 0,
    "field_goals_made" INTEGER NOT NULL DEFAULT 0,
    "field_goals_attempted" INTEGER NOT NULL DEFAULT 0,
    "three_points_made" INTEGER NOT NULL DEFAULT 0,
    "three_points_attempted" INTEGER NOT NULL DEFAULT 0,
    "free_throws_made" INTEGER NOT NULL DEFAULT 0,
    "free_throws_attempted" INTEGER NOT NULL DEFAULT 0,
    "plus_minus" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "player_game_stats_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "live_events" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "player_id" INTEGER,
    "event_type" TEXT NOT NULL,
    "event_description" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "clock" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "live_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "analytics_snapshots" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "impact_score" DOUBLE PRECISION NOT NULL,
    "fantasy_score" DOUBLE PRECISION NOT NULL,
    "usage_rate" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analytics_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "teams_external_id_key" ON "teams"("external_id");
CREATE UNIQUE INDEX "players_external_id_key" ON "players"("external_id");
CREATE INDEX "players_team_id_idx" ON "players"("team_id");
CREATE UNIQUE INDEX "games_external_id_key" ON "games"("external_id");
CREATE INDEX "games_home_team_id_idx" ON "games"("home_team_id");
CREATE INDEX "games_away_team_id_idx" ON "games"("away_team_id");
CREATE INDEX "games_game_date_idx" ON "games"("game_date");
CREATE UNIQUE INDEX "player_game_stats_game_id_player_id_key" ON "player_game_stats"("game_id", "player_id");
CREATE INDEX "player_game_stats_team_id_idx" ON "player_game_stats"("team_id");
CREATE INDEX "player_game_stats_player_id_idx" ON "player_game_stats"("player_id");
CREATE INDEX "live_events_game_id_idx" ON "live_events"("game_id");
CREATE INDEX "live_events_player_id_idx" ON "live_events"("player_id");
CREATE UNIQUE INDEX "analytics_snapshots_game_id_player_id_key" ON "analytics_snapshots"("game_id", "player_id");
CREATE INDEX "analytics_snapshots_player_id_idx" ON "analytics_snapshots"("player_id");

ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "games" ADD CONSTRAINT "games_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "games" ADD CONSTRAINT "games_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "player_game_stats" ADD CONSTRAINT "player_game_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "player_game_stats" ADD CONSTRAINT "player_game_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "player_game_stats" ADD CONSTRAINT "player_game_stats_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "live_events" ADD CONSTRAINT "live_events_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "live_events" ADD CONSTRAINT "live_events_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "analytics_snapshots" ADD CONSTRAINT "analytics_snapshots_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "analytics_snapshots" ADD CONSTRAINT "analytics_snapshots_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
