from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pandas as pd


PIPELINE_ROOT = Path(__file__).resolve().parents[1]
RAW_OUTPUT_DIR = PIPELINE_ROOT / "output" / "raw"
TRANSFORMED_OUTPUT_DIR = PIPELINE_ROOT / "output" / "transformed"


def safe_percentage(made: pd.Series, attempted: pd.Series) -> pd.Series:
    return (made / attempted.replace({0: pd.NA}) * 100).fillna(0).round(2)


def read_json(filename: str) -> list[dict[str, Any]]:
    with (RAW_OUTPUT_DIR / filename).open(encoding="utf-8") as file:
        return json.load(file)


def write_json(filename: str, rows: list[dict[str, Any]]) -> None:
    TRANSFORMED_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with (TRANSFORMED_OUTPUT_DIR / filename).open("w", encoding="utf-8") as file:
        json.dump(rows, file, indent=2)


def main() -> None:
    teams = pd.DataFrame(read_json("teams.json"))
    players = pd.DataFrame(read_json("players.json"))
    games = pd.DataFrame(read_json("games.json"))
    stats = pd.DataFrame(read_json("player_game_stats.json"))

    players["full_name"] = players["first_name"] + " " + players["last_name"]
    stats["efficiency"] = (
        stats["points"]
        + stats["rebounds"]
        + stats["assists"]
        + stats["steals"]
        + stats["blocks"]
        - stats["turnovers"]
    )
    stats["impact_score"] = (
        stats["points"]
        + stats["rebounds"] * 1.2
        + stats["assists"] * 1.5
        + stats["steals"] * 2
        + stats["blocks"] * 2
        - stats["turnovers"] * 1.3
    ).round(2)
    stats["fg_percentage"] = safe_percentage(stats["field_goals_made"], stats["field_goals_attempted"])
    stats["three_point_percentage"] = safe_percentage(stats["three_points_made"], stats["three_points_attempted"])
    stats["free_throw_percentage"] = safe_percentage(stats["free_throws_made"], stats["free_throws_attempted"])

    for name, frame in {
        "teams.json": teams,
        "players.json": players,
        "games.json": games,
        "player_game_stats.json": stats,
    }.items():
        write_json(name, frame.to_dict(orient="records"))
        frame.to_csv(TRANSFORMED_OUTPUT_DIR / name.replace(".json", ".csv"), index=False)
        print(f"Transformed {len(frame)} rows into output/transformed/{name}")


if __name__ == "__main__":
    main()
