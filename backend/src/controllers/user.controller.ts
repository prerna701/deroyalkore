import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { getPagination } from '../utils/pagination';

class UserController {
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = getPagination(req.query);
    const result = await userService.getAllUsers(page, limit);

    ApiResponse.paginated(res, result.items, result.meta, 'Users fetched successfully');
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    ApiResponse.ok(res, user, 'User fetched successfully');
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    ApiResponse.created(res, user, 'User created successfully');
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateUser(req.params.id, req.body);
    ApiResponse.updated(res, user, 'User updated successfully');
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id);
    ApiResponse.deleted(res, 'User deleted successfully');
  });
}

export const userController = new UserController();
