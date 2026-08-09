import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { isProd } from '../config/env';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: unknown;

  const isApiErr = err instanceof ApiError || (err !== null && typeof err === 'object' && 'statusCode' in err && 'isOperational' in err);
  const apiErr = err as any;

  if (isApiErr) {
    statusCode = apiErr.statusCode;
    message = apiErr.message;
    details = apiErr.details;
  } else if (err instanceof Error) {
    message = isProd ? 'Internal Server Error' : err.message;
  }

  // Unexpected (non-operational) errors are logged loudly - these are bugs to fix.
  if (!isApiErr || !apiErr.isOperational) {
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
