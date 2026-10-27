import type { AsyncController } from "../types/api";
import { ApiError } from "../types/api";
import { analyticsService } from "../services/analyticsService";
import { playerComparisonQuerySchema } from "../validators/analyticsValidators";

export const dashboardSummary: AsyncController = async (_req, res) => {
  res.json(await analyticsService.dashboardSummary());
};

export const topPerformers: AsyncController = async (_req, res) => {
  res.json(await analyticsService.topPerformers());
};

export const playerComparison: AsyncController = async (req, res) => {
  const parsed = playerComparisonQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new ApiError(400, `Parâmetros inválidos: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`);
  }

  res.json(
    await analyticsService.comparePlayers(
      parsed.data.playerAId,
      parsed.data.playerBId
    )
  );
};
