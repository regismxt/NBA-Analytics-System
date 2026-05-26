import type { AsyncController } from "../types/api";

export function asyncHandler(controller: AsyncController): AsyncController {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
