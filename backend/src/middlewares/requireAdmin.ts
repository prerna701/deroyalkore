import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';

export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length).trim() : '';

  if (!token) {
    next(ApiError.unauthorized('Admin authorization token is required'));
    return;
  }

  const session = authService.validateAdminToken(token);

  if (!session || session.role !== 'admin') {
    next(ApiError.forbidden('Only admins can access this route'));
    return;
  }

  next();
};
