import { Router } from "express";
import { getGame, getGamePlayerStats, listGames, listLiveGames } from "../controllers/gameController";
import { asyncHandler } from "../utils/asyncHandler";

export const gameRoutes = Router();

gameRoutes.get("/", asyncHandler(listGames));
gameRoutes.get("/live", asyncHandler(listLiveGames));
gameRoutes.get("/:id", asyncHandler(getGame));
gameRoutes.get("/:id/player-stats", asyncHandler(getGamePlayerStats));
