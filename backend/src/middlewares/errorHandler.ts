import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { isProd } from '../config/env';

/**
 * Every error in the app - thrown in a controller, service, repository,
 * or passed to next(err) - ends up here. This is the ONLY place that
 * builds the error JSON, so every failed request looks the same:
 *
 * {
 *   "success": false,
 *   "statusCode": 404,
 *   "message": "User not found",
 *   "details": [...]   // optional, e.g. validation field errors
 * }
 *
 * Must be registered LAST, after all routes.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    message = isProd ? 'Internal Server Error' : err.message;
  }

  // Unexpected (non-operational) errors are logged loudly - these are bugs to fix.
  if (!(err instanceof ApiError) || !err.isOperational) {
    logger.error(`${req.method} ${req.originalUrl} -> ${statusCode}`, { error: err });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(details ? { errors: details } : {}),
    meta: {
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId,
    },
    ...(!isProd && err instanceof Error ? { stack: err.stack } : {}),
  });
};
