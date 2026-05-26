from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Connection


PIPELINE_ROOT = Path(__file__).resolve().parents[1]
TRANSFORMED_OUTPUT_DIR = PIPELINE_ROOT / "output" / "transformed"


def read_json(filename: str) -> list[dict[str, Any]]:
    with (TRANSFORMED_OUTPUT_DIR / filename).open(encoding="utf-8") as file:
        return json.load(file)


def load_id_map(connection: Connection, table: str) -> dict[str, int]:
    rows = connection.execute(text(f"SELECT external_id, id FROM {table}")).mappings().all()
    return {row["external_id"]: row["id"] for row in rows}


def upsert_team(connection: Connection, row: dict[str, Any]) -> None:
    connection.execute(
        text(
            """
            INSERT INTO teams (external_id, name, abbreviation, city, conference, division, updated_at)
            VALUES (:external_id, :name, :abbreviation, :city, :conference, :division, NOW())
            ON CONFLICT (external_id) DO UPDATE SET
              name = EXCLUDED.name,
              abbreviation = EXCLUDED.abbreviation,
              city = EXCLUDED.city,
              conference = EXCLUDED.conference,
              division = EXCLUDED.division,
              updated_at = NOW()
            """
        ),
        row,
    )


def upsert_player(connection: Connection, row: dict[str, Any], team_ids: dict[str, int]) -> None:
    payload = {**row, "team_id": team_ids[row["team_external_id"]]}
    connection.execute(
        text(
            """
            INSERT INTO players (
              external_id, first_name, last_name, full_name, position, team_id,
              height, weight, birth_date, active, updated_at
            )
            VALUES (
              :external_id, :first_name, :last_name, :full_name, :position, :team_id,
              :height, :weight, :birth_date, :active, NOW()
            )
            ON CONFLICT (external_id) DO UPDATE SET
              first_name = EXCLUDED.first_name,
              last_name = EXCLUDED.last_name,
              full_name = EXCLUDED.full_name,
              position = EXCLUDED.position,
              team_id = EXCLUDED.team_id,
              height = EXCLUDED.height,
              weight = EXCLUDED.weight,
              birth_date = EXCLUDED.birth_date,
              active = EXCLUDED.active,
              updated_at = NOW()
            """
        ),
        payload,
    )


def upsert_game(connection: Connection, row: dict[str, Any], team_ids: dict[str, int]) -> None:
    payload = {
        **row,
        "home_team_id": team_ids[row["home_team_external_id"]],
        "away_team_id": team_ids[row["away_team_external_id"]],
    }
    connection.execute(
        text(
            """
            INSERT INTO games (
              external_id, home_team_id, away_team_id, game_date, status, season,
              home_score, away_score, period, clock, updated_at
            )
            VALUES (
              :external_id, :home_team_id, :away_team_id, :game_date, :status, :season,
              :home_score, :away_score, :period, :clock, NOW()
            )
            ON CONFLICT (external_id) DO UPDATE SET
              home_team_id = EXCLUDED.home_team_id,
              away_team_id = EXCLUDED.away_team_id,
              game_date = EXCLUDED.game_date,
              status = EXCLUDED.status,
              season = EXCLUDED.season,
              home_score = EXCLUDED.home_score,
              away_score = EXCLUDED.away_score,
              period = EXCLUDED.period,
              clock = EXCLUDED.clock,
              updated_at = NOW()
            """
        ),
        payload,
    )


def upsert_stat(
    connection: Connection,
    row: dict[str, Any],
    game_ids: dict[str, int],
    player_ids: dict[str, int],
    team_ids: dict[str, int],
) -> None:
    payload = {
        **row,
        "game_id": game_ids[row["game_external_id"]],
        "player_id": player_ids[row["player_external_id"]],
        "team_id": team_ids[row["team_external_id"]],
    }
    connection.execute(
        text(
            """
            INSERT INTO player_game_stats (
              game_id, player_id, team_id, minutes_played, points, rebounds, assists, steals, blocks,
              turnovers, field_goals_made, field_goals_attempted, three_points_made,
              three_points_attempted, free_throws_made, free_throws_attempted, plus_minus, updated_at
            )
            VALUES (
              :game_id, :player_id, :team_id, :minutes_played, :points, :rebounds, :assists, :steals,
              :blocks, :turnovers, :field_goals_made, :field_goals_attempted, :three_points_made,
              :three_points_attempted, :free_throws_made, :free_throws_attempted, :plus_minus, NOW()
            )
            ON CONFLICT (game_id, player_id) DO UPDATE SET
              minutes_played = EXCLUDED.minutes_played,
              points = EXCLUDED.points,
              rebounds = EXCLUDED.rebounds,
              assists = EXCLUDED.assists,
              steals = EXCLUDED.steals,
              blocks = EXCLUDED.blocks,
              turnovers = EXCLUDED.turnovers,
              field_goals_made = EXCLUDED.field_goals_made,
              field_goals_attempted = EXCLUDED.field_goals_attempted,
              three_points_made = EXCLUDED.three_points_made,
              three_points_attempted = EXCLUDED.three_points_attempted,
              free_throws_made = EXCLUDED.free_throws_made,
              free_throws_attempted = EXCLUDED.free_throws_attempted,
              plus_minus = EXCLUDED.plus_minus,
              updated_at = NOW()
            """
        ),
        payload,
    )


def main() -> None:
    load_dotenv()
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is required")

    engine = create_engine(database_url)
    teams = read_json("teams.json")
    players = read_json("players.json")
    games = read_json("games.json")
    stats = read_json("player_game_stats.json")

    with engine.begin() as connection:
        for row in teams:
            upsert_team(connection, row)
        team_ids = load_id_map(connection, "teams")

        for row in players:
            upsert_player(connection, row, team_ids)
        player_ids = load_id_map(connection, "players")

        for row in games:
            upsert_game(connection, row, team_ids)
        game_ids = load_id_map(connection, "games")

        for row in stats:
            upsert_stat(connection, row, game_ids, player_ids, team_ids)

    print("PostgreSQL load completed.")


if __name__ == "__main__":
    main()
