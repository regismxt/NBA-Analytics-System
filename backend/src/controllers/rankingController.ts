import type { AsyncController } from "../types/api";
import { rankingService } from "../services/rankingService";

function limitFromQuery(value: unknown) {
  if (typeof value !== "string") return 10;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 10;
}

export const pointsRanking: AsyncController = async (req, res) => {
  res.json(await rankingService.points(limitFromQuery(req.query.limit)));
};

export const assistsRanking: AsyncController = async (req, res) => {
  res.json(await rankingService.assists(limitFromQuery(req.query.limit)));
};

export const reboundsRanking: AsyncController = async (req, res) => {
  res.json(await rankingService.rebounds(limitFromQuery(req.query.limit)));
};
