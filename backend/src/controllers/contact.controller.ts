import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { contactService } from '../services/contact.service';

class ContactController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const records = await contactService.getAll();
    ApiResponse.ok(res, records, 'Contact sections fetched successfully');
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const record = await contactService.getById(req.params.id);
    ApiResponse.ok(res, record, 'Contact section fetched successfully');
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const record = await contactService.create(req.body);
    ApiResponse.created(res, record, 'Contact section created successfully');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const record = await contactService.update(req.params.id, req.body);
    ApiResponse.ok(res, record, 'Contact section updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await contactService.delete(req.params.id);
    ApiResponse.ok(res, null, 'Contact section deleted successfully');
  });
}

export const contactController = new ContactController();
