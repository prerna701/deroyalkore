import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { beforeAfterService } from '../services/beforeAfter.service';

const getBaseUrl = (req: Request) => `${req.protocol}://${req.get('host')}`;

class BeforeAfterController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const cases = await beforeAfterService.getAllCases(getBaseUrl(req));
    ApiResponse.ok(res, cases, 'Before & After cases fetched successfully');
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as { before?: Express.Multer.File[]; after?: Express.Multer.File[] } | undefined;
    
    const result = await beforeAfterService.createCase(req.body, files, getBaseUrl(req));

    ApiResponse.created(res, result, 'Before & After case created successfully');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const files = req.files as { before?: Express.Multer.File[]; after?: Express.Multer.File[] } | undefined;
    const result = await beforeAfterService.updateCase(id, req.body, files, getBaseUrl(req));
    ApiResponse.ok(res, result, 'Before & After case updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await beforeAfterService.deleteCase(id);
    ApiResponse.ok(res, null, 'Before & After case deleted successfully');
  });
}

export const beforeAfterController = new BeforeAfterController();
