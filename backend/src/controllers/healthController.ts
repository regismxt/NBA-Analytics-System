import { prisma } from "../lib/prisma";
import type { AsyncController } from "../types/api";

export const healthController: AsyncController = async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({
    status: "ok",
    service: "nba-live-analytics-api",
    timestamp: new Date().toISOString()
  });
};
