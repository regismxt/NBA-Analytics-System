import { Router } from "express";
import { dashboardSummary, playerComparison, topPerformers } from "../controllers/analyticsController";
import { asyncHandler } from "../utils/asyncHandler";

export const analyticsRoutes = Router();

analyticsRoutes.get("/summary", asyncHandler(dashboardSummary));
analyticsRoutes.get("/top-performers", asyncHandler(topPerformers));
analyticsRoutes.get("/player-comparison", asyncHandler(playerComparison));
