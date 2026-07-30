import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { galleryService } from '../services/gallery.service';

class GalleryController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const records = await galleryService.getAll();
    ApiResponse.ok(res, records, 'Gallery sections fetched successfully');
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const record = await galleryService.getById(req.params.id);
    ApiResponse.ok(res, record, 'Gallery section fetched successfully');
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const record = await galleryService.create(req.body);
    ApiResponse.created(res, record, 'Gallery section created successfully');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const record = await galleryService.update(req.params.id, req.body);
    ApiResponse.ok(res, record, 'Gallery section updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await galleryService.delete(req.params.id);
    ApiResponse.ok(res, null, 'Gallery section deleted successfully');
  });
}

export const galleryController = new GalleryController();
