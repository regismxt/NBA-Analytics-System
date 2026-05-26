import { prisma } from "../lib/prisma";

export const teamRepository = {
  findAll() {
    return prisma.team.findMany({
      orderBy: [{ conference: "asc" }, { city: "asc" }],
      include: {
        _count: {
          select: { players: true, homeGames: true, awayGames: true }
        }
      }
    });
  },

  findById(id: number) {
    return prisma.team.findUnique({
      where: { id },
      include: {
        players: { orderBy: { fullName: "asc" } },
        homeGames: { include: { homeTeam: true, awayTeam: true }, orderBy: { gameDate: "desc" } },
        awayGames: { include: { homeTeam: true, awayTeam: true }, orderBy: { gameDate: "desc" } }
      }
    });
  }
};
