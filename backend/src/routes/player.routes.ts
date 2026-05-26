import { Router } from "express";
import { getPlayer, listPlayers } from "../controllers/playerController";
import { asyncHandler } from "../utils/asyncHandler";

export const playerRoutes = Router();

playerRoutes.get("/", asyncHandler(listPlayers));
playerRoutes.get("/:id", asyncHandler(getPlayer));
