from __future__ import annotations

import json
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any


PIPELINE_ROOT = Path(__file__).resolve().parents[1]
MOCK_DATA_DIR = PIPELINE_ROOT / "mock_data"
RAW_OUTPUT_DIR = PIPELINE_ROOT / "output" / "raw"


class NbaDataProvider(ABC):
    @abstractmethod
    def fetch_teams(self) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def fetch_players(self) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def fetch_games(self) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def fetch_player_game_stats(self) -> list[dict[str, Any]]:
        raise NotImplementedError


class MockNbaDataProvider(NbaDataProvider):
    def _load(self, filename: str) -> list[dict[str, Any]]:
        with (MOCK_DATA_DIR / filename).open(encoding="utf-8") as file:
            return json.load(file)

    def fetch_teams(self) -> list[dict[str, Any]]:
        return self._load("teams.json")

    def fetch_players(self) -> list[dict[str, Any]]:
        return self._load("players.json")

    def fetch_games(self) -> list[dict[str, Any]]:
        return self._load("games.json")

    def fetch_player_game_stats(self) -> list[dict[str, Any]]:
        return self._load("player_game_stats.json")


def write_json(filename: str, rows: list[dict[str, Any]]) -> None:
    RAW_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with (RAW_OUTPUT_DIR / filename).open("w", encoding="utf-8") as file:
        json.dump(rows, file, indent=2)


def main() -> None:
    provider: NbaDataProvider = MockNbaDataProvider()
    datasets = {
        "teams.json": provider.fetch_teams(),
        "players.json": provider.fetch_players(),
        "games.json": provider.fetch_games(),
        "player_game_stats.json": provider.fetch_player_game_stats(),
    }

    for filename, rows in datasets.items():
        write_json(filename, rows)
        print(f"Collected {len(rows)} rows into output/raw/{filename}")


if __name__ == "__main__":
    main()
