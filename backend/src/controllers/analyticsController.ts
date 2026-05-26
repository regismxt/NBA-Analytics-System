import type { AsyncController } from "../types/api";
import { analyticsService } from "../services/analyticsService";

export const dashboardSummary: AsyncController = async (_req, res) => {
  res.json(await analyticsService.dashboardSummary());
};

export const topPerformers: AsyncController = async (_req, res) => {
  res.json(await analyticsService.topPerformers());
};

export const playerComparison: AsyncController = async (req, res) => {
  res.json(
    await analyticsService.comparePlayers(
      Number(req.query.playerAId),
      Number(req.query.playerBId)
    )
  );
};
