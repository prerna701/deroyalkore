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

  // Upload multiple gallery images, returns array of { url, filename }
  uploadImages = asyncHandler(async (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      ApiResponse.ok(res, [], 'No files uploaded');
      return;
    }

    const uploaded = files.map((file) => ({
      url: `/uploads/gallery/${file.filename}`,
      publicUrl: `${baseUrl}/uploads/gallery/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
    }));

    ApiResponse.ok(res, uploaded, `${uploaded.length} image(s) uploaded successfully`);
  });
}

export const galleryController = new GalleryController();

