import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { aboutService } from '../services/about.service';

class AboutController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const records = await aboutService.getAll();
    ApiResponse.ok(res, records, 'About sections fetched successfully');
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const record = await aboutService.getById(req.params.id);
    ApiResponse.ok(res, record, 'About section fetched successfully');
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const record = await aboutService.create(req.body);
    ApiResponse.created(res, record, 'About section created successfully');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const record = await aboutService.update(req.params.id, req.body);
    ApiResponse.ok(res, record, 'About section updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await aboutService.delete(req.params.id);
    ApiResponse.ok(res, null, 'About section deleted successfully');
  });
}

export const aboutController = new AboutController();
