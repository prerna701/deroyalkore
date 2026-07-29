import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { authService } from '../services/auth.service';

class AuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password).trim();

    if (!authService.isValidAdminCredentials(normalizedEmail, normalizedPassword)) {
      throw ApiError.unauthorized('Invalid admin credentials');
    }

    const access = authService.createAdminSession(normalizedEmail);

    ApiResponse.ok(res, {
      user: {
        email: normalizedEmail,
        role: 'admin',
      },
      tokens: {
        access,
      },
    }, 'Login successful');
  });
}

export const authController = new AuthController();
