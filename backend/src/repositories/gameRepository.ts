import { prisma } from "../lib/prisma";

export const gameRepository = {
  findAll(status?: string) {
    return prisma.game.findMany({
      where: status ? { status } : undefined,
      include: { homeTeam: true, awayTeam: true, _count: { select: { playerStats: true } } },
      orderBy: { gameDate: "desc" }
    });
  },

  findLive() {
    return this.findAll("LIVE");
  },

  findById(id: number) {
    return prisma.game.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        liveEvents: { include: { player: true }, orderBy: { createdAt: "desc" } }
      }
    });
  },

  findStats(gameId: number) {
    return prisma.playerGameStat.findMany({
      where: { gameId },
      include: { player: { include: { team: true } }, team: true },
      orderBy: [{ points: "desc" }, { rebounds: "desc" }]
    });
  }
};
