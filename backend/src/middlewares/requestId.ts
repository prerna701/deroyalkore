import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const requestIdMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  res.locals.requestId = randomUUID();
  next();
};
