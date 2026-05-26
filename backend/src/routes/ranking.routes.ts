import { Router } from "express";
import { assistsRanking, pointsRanking, reboundsRanking } from "../controllers/rankingController";
import { asyncHandler } from "../utils/asyncHandler";

export const rankingRoutes = Router();

rankingRoutes.get("/points", asyncHandler(pointsRanking));
rankingRoutes.get("/assists", asyncHandler(assistsRanking));
rankingRoutes.get("/rebounds", asyncHandler(reboundsRanking));
