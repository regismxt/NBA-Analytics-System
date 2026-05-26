import { Router } from "express";
import { getTeam, listTeams } from "../controllers/teamController";
import { asyncHandler } from "../utils/asyncHandler";

export const teamRoutes = Router();

teamRoutes.get("/", asyncHandler(listTeams));
teamRoutes.get("/:id", asyncHandler(getTeam));
