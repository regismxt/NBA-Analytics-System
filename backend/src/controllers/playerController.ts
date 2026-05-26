import type { AsyncController } from "../types/api";
import { playerService } from "../services/playerService";

export const listPlayers: AsyncController = async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const teamId = typeof req.query.teamId === "string" ? Number(req.query.teamId) : undefined;
  res.json(await playerService.listPlayers(search, teamId));
};

export const getPlayer: AsyncController = async (req, res) => {
  res.json(await playerService.getPlayer(Number(req.params.id)));
};
