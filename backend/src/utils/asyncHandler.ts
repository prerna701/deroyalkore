import { NextFunction, Request, Response } from 'express';

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wrap every async controller function with this.
 * It catches any rejected promise / thrown error and forwards it to
 * next(), so it lands in the global error handler instead of crashing
 * the process or leaving the request hanging.
 *
 * Usage:
 *   router.get('/', asyncHandler(userController.getAllUsers));
 */
export const asyncHandler =
  (fn: AsyncFn) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
