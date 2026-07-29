import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Catches any request that didn't match a route above it and forwards
 * a clean 404 into the error handler, instead of Express's default
 * HTML "Cannot GET /foo" page.
 *
 * Must be registered AFTER all routes but BEFORE the error handler.
 */
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route not found - ${req.method} ${req.originalUrl}`));
};
