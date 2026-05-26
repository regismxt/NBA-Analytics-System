import type { AsyncController } from "../types/api";
import { gameService } from "../services/gameService";

export const listGames: AsyncController = async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  res.json(await gameService.listGames(status));
};

export const listLiveGames: AsyncController = async (_req, res) => {
  res.json(await gameService.listLiveGames());
};

export const getGame: AsyncController = async (req, res) => {
  res.json(await gameService.getGame(Number(req.params.id)));
};

export const getGamePlayerStats: AsyncController = async (req, res) => {
  res.json(await gameService.getPlayerStats(Number(req.params.id)));
};
