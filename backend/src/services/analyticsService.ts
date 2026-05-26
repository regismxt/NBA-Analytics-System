import { prisma } from "../lib/prisma";
import { statRepository } from "../repositories/statRepository";
import { ApiError } from "../types/api";
import { efficiencyScore, impactScore, round, safePercentage } from "../utils/metrics";
import { rankingService } from "./rankingService";

function summarizePlayer(playerStats: Awaited<ReturnType<typeof statRepository.findByPlayerIds>>, playerId: number) {
  const stats = playerStats.filter((stat) => stat.playerId === playerId);
  const player = stats[0]?.player;
  const gamesPlayed = stats.length;
  const totals = stats.reduce(
    (acc, stat) => {
      acc.points += stat.points;
      acc.rebounds += stat.rebounds;
      acc.assists += stat.assists;
      acc.steals += stat.steals;
      acc.blocks += stat.blocks;
      acc.turnovers += stat.turnovers;
      acc.fieldGoalsMade += stat.fieldGoalsMade;
      acc.fieldGoalsAttempted += stat.fieldGoalsAttempted;
      acc.threePointsMade += stat.threePointsMade;
      acc.threePointsAttempted += stat.threePointsAttempted;
      acc.freeThrowsMade += stat.freeThrowsMade;
      acc.freeThrowsAttempted += stat.freeThrowsAttempted;
      acc.efficiency += efficiencyScore(stat);
      acc.impactScore += impactScore(stat);
      return acc;
    },
    {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fieldGoalsMade: 0,
      fieldGoalsAttempted: 0,
      threePointsMade: 0,
      threePointsAttempted: 0,
      freeThrowsMade: 0,
      freeThrowsAttempted: 0,
      efficiency: 0,
      impactScore: 0
    }
  );

  return {
    player,
    gamesPlayed,
    totals,
    averages: {
      points: gamesPlayed ? round(totals.points / gamesPlayed) : 0,
      rebounds: gamesPlayed ? round(totals.rebounds / gamesPlayed) : 0,
      assists: gamesPlayed ? round(totals.assists / gamesPlayed) : 0,
      efficiency: gamesPlayed ? round(totals.efficiency / gamesPlayed) : 0,
      impactScore: gamesPlayed ? round(totals.impactScore / gamesPlayed) : 0,
      fgPercentage: safePercentage(totals.fieldGoalsMade, totals.fieldGoalsAttempted),
      threePointPercentage: safePercentage(totals.threePointsMade, totals.threePointsAttempted),
      freeThrowPercentage: safePercentage(totals.freeThrowsMade, totals.freeThrowsAttempted)
    },
    gameLog: stats
  };
}

export const analyticsService = {
  async dashboardSummary() {
    const [gamesCount, playersCount, recentGames, topScorers, efficientPlayers] = await Promise.all([
      prisma.game.count(),
      prisma.player.count(),
      prisma.game.findMany({
        take: 5,
        include: { homeTeam: true, awayTeam: true },
        orderBy: { gameDate: "desc" }
      }),
      rankingService.points(10),
      rankingService.efficiency(10)
    ]);

    return {
      totals: {
        games: gamesCount,
        players: playersCount,
        topScorer: topScorers[0] ?? null,
        mostEfficient: efficientPlayers[0] ?? null
      },
      recentGames,
      topScorers
    };
  },

  async topPerformers() {
    const [points, assists, rebounds, efficiency, impact] = await Promise.all([
      rankingService.points(10),
      rankingService.assists(10),
      rankingService.rebounds(10),
      rankingService.efficiency(10),
      rankingService.impact(10)
    ]);

    return { points, assists, rebounds, efficiency, impact };
  },

  async comparePlayers(playerAId: number, playerBId: number) {
    if (!playerAId || !playerBId) {
      throw new ApiError(400, "playerAId and playerBId are required");
    }

    const players = await prisma.player.findMany({
      where: { id: { in: [playerAId, playerBId] } },
      include: { team: true }
    });
    if (players.length !== 2) throw new ApiError(404, "One or both players were not found");

    const stats = await statRepository.findByPlayerIds([playerAId, playerBId]);
    return {
      playerA: summarizePlayer(stats, playerAId),
      playerB: summarizePlayer(stats, playerBId)
    };
  }
};
