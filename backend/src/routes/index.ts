import { Router } from "express";
import { analyticsRoutes } from "./analytics.routes";
import { gameRoutes } from "./game.routes";
import { healthRoutes } from "./health.routes";
import { playerRoutes } from "./player.routes";
import { rankingRoutes } from "./ranking.routes";
import { teamRoutes } from "./team.routes";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/teams", teamRoutes);
apiRoutes.use("/players", playerRoutes);
apiRoutes.use("/games", gameRoutes);
apiRoutes.use("/rankings", rankingRoutes);
apiRoutes.use("/analytics", analyticsRoutes);
