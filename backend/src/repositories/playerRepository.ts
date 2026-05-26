import { prisma } from "../lib/prisma";

export const playerRepository = {
  findAll(search?: string, teamId?: number) {
    return prisma.player.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { fullName: { contains: search, mode: "insensitive" } },
                { position: { contains: search, mode: "insensitive" } }
              ]
            }
          : {}),
        ...(teamId ? { teamId } : {})
      },
      include: { team: true, stats: true },
      orderBy: { fullName: "asc" }
    });
  },

  findById(id: number) {
    return prisma.player.findUnique({
      where: { id },
      include: {
        team: true,
        stats: {
          include: { game: { include: { homeTeam: true, awayTeam: true } } },
          orderBy: { game: { gameDate: "desc" } }
        }
      }
    });
  }
};
