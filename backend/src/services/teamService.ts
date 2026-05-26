import { ApiError } from "../types/api";
import { teamRepository } from "../repositories/teamRepository";

export const teamService = {
  listTeams() {
    return teamRepository.findAll();
  },

  async getTeam(id: number) {
    const team = await teamRepository.findById(id);
    if (!team) throw new ApiError(404, "Team not found");

    const games = [...team.homeGames, ...team.awayGames].sort(
      (a, b) => b.gameDate.getTime() - a.gameDate.getTime()
    );

    return { ...team, games };
  }
};
