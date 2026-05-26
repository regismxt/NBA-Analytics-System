import type { PlayerGameStat } from "@prisma/client";
import { ApiError } from "../types/api";
import { playerRepository } from "../repositories/playerRepository";
import { efficiencyScore, enrichStat, impactScore, round } from "../utils/metrics";

function average(stats: PlayerGameStat[], key: keyof PlayerGameStat) {
  if (!stats.length) return 0;
  const total = stats.reduce((sum, stat) => sum + Number(stat[key] ?? 0), 0);
  return round(total / stats.length);
}

function averageProfile(stats: PlayerGameStat[]) {
  return {
    gamesPlayed: stats.length,
    points: average(stats, "points"),
    rebounds: average(stats, "rebounds"),
    assists: average(stats, "assists"),
    steals: average(stats, "steals"),
    blocks: average(stats, "blocks"),
    turnovers: average(stats, "turnovers"),
    efficiency: stats.length ? round(stats.reduce((sum, stat) => sum + efficiencyScore(stat), 0) / stats.length) : 0,
    impactScore: stats.length ? round(stats.reduce((sum, stat) => sum + impactScore(stat), 0) / stats.length) : 0
  };
}

export const playerService = {
  async listPlayers(search?: string, teamId?: number) {
    const players = await playerRepository.findAll(search, teamId);
    return players.map((player) => ({
      ...player,
      averages: averageProfile(player.stats)
    }));
  },

  async getPlayer(id: number) {
    const player = await playerRepository.findById(id);
    if (!player) throw new ApiError(404, "Player not found");

    return {
      ...player,
      averages: averageProfile(player.stats),
      stats: player.stats.map((stat) => enrichStat(stat))
    };
  }
};
