import type { Request, Response, NextFunction } from "express";

export type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
