import type { ErrorRequestHandler } from "express";
import { ApiError } from "../types/api";
import { env } from "../config/env";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : "Unexpected server error";

  res.status(statusCode).json({
    message,
    ...(env.NODE_ENV !== "production" ? { stack: error instanceof Error ? error.stack : undefined } : {})
  });
};
