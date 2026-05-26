import { prisma } from "../lib/prisma";

export const statRepository = {
  findAllWithPlayer() {
    return prisma.playerGameStat.findMany({
      include: {
        player: { include: { team: true } },
        team: true,
        game: { include: { homeTeam: true, awayTeam: true } }
      }
    });
  },

  findByPlayerIds(playerIds: number[]) {
    return prisma.playerGameStat.findMany({
      where: { playerId: { in: playerIds } },
      include: {
        player: { include: { team: true } },
        game: { include: { homeTeam: true, awayTeam: true } }
      },
      orderBy: { game: { gameDate: "desc" } }
    });
  }
};
