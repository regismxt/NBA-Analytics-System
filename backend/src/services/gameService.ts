import { ApiError } from "../types/api";
import { gameRepository } from "../repositories/gameRepository";
import { enrichStat } from "../utils/metrics";

export const gameService = {
  listGames(status?: string) {
    return gameRepository.findAll(status);
  },

  listLiveGames() {
    return gameRepository.findLive();
  },

  async getGame(id: number) {
    const game = await gameRepository.findById(id);
    if (!game) throw new ApiError(404, "Game not found");
    return game;
  },

  async getPlayerStats(gameId: number) {
    const game = await gameRepository.findById(gameId);
    if (!game) throw new ApiError(404, "Game not found");

    const stats = await gameRepository.findStats(gameId);
    return stats.map((stat) => enrichStat(stat));
  }
};
