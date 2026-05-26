import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { apiRoutes } from "./routes";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);
