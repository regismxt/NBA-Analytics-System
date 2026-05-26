import type { AsyncController } from "../types/api";
import { teamService } from "../services/teamService";

export const listTeams: AsyncController = async (_req, res) => {
  res.json(await teamService.listTeams());
};

export const getTeam: AsyncController = async (req, res) => {
  res.json(await teamService.getTeam(Number(req.params.id)));
};
