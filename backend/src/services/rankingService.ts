import { statRepository } from "../repositories/statRepository";
import { efficiencyScore, impactScore, round } from "../utils/metrics";

type RankingMetric = "points" | "assists" | "rebounds" | "efficiency" | "impactScore";

export async function buildPlayerRanking(metric: RankingMetric, limit = 10) {
  const stats = await statRepository.findAllWithPlayer();
  const grouped = new Map<number, { player: (typeof stats)[number]["player"]; totals: Record<string, number>; games: number }>();

  for (const stat of stats) {
    const current =
      grouped.get(stat.playerId) ??
      {
        player: stat.player,
        totals: {
          points: 0,
          assists: 0,
          rebounds: 0,
          steals: 0,
          blocks: 0,
          turnovers: 0,
          efficiency: 0,
          impactScore: 0
        },
        games: 0
      };

    current.games += 1;
    current.totals.points += stat.points;
    current.totals.assists += stat.assists;
    current.totals.rebounds += stat.rebounds;
    current.totals.steals += stat.steals;
    current.totals.blocks += stat.blocks;
    current.totals.turnovers += stat.turnovers;
    current.totals.efficiency += efficiencyScore(stat);
    current.totals.impactScore += impactScore(stat);
    grouped.set(stat.playerId, current);
  }

  return [...grouped.values()]
    .map((row) => ({
      playerId: row.player.id,
      fullName: row.player.fullName,
      position: row.player.position,
      team: row.player.team.abbreviation,
      gamesPlayed: row.games,
      total: round(row.totals[metric]),
      average: row.games ? round(row.totals[metric] / row.games) : 0,
      totals: row.totals
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export const rankingService = {
  points(limit?: number) {
    return buildPlayerRanking("points", limit);
  },
  assists(limit?: number) {
    return buildPlayerRanking("assists", limit);
  },
  rebounds(limit?: number) {
    return buildPlayerRanking("rebounds", limit);
  },
  efficiency(limit?: number) {
    return buildPlayerRanking("efficiency", limit);
  },
  impact(limit?: number) {
    return buildPlayerRanking("impactScore", limit);
  }
};
