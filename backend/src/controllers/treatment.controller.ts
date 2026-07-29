import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { treatmentService } from '../services/treatment.service';

const getBaseUrl = (req: Request) => `${req.protocol}://${req.get('host')}`;

class TreatmentController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const treatments = await treatmentService.getAllTreatments(getBaseUrl(req));
    ApiResponse.ok(res, treatments, 'Treatments fetched successfully');
  });

  getByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const treatment = await treatmentService.getTreatmentByIdOrSlug(id, getBaseUrl(req));
    ApiResponse.ok(res, treatment, 'Treatment fetched successfully');
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as { image?: Express.Multer.File[] } | undefined;
    const imageFile = files?.image?.[0];
    
    const treatment = await treatmentService.createTreatment(req.body, imageFile, getBaseUrl(req));
    
    ApiResponse.created(res, { treatment }, 'Treatment created successfully');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const files = req.files as { image?: Express.Multer.File[] } | undefined;
    const imageFile = files?.image?.[0];

    const treatment = await treatmentService.updateTreatment(id, req.body, imageFile, getBaseUrl(req));
    
    ApiResponse.ok(res, { treatment }, 'Treatment updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await treatmentService.deleteTreatment(id);
    ApiResponse.ok(res, null, 'Treatment deleted successfully');
  });
}

export const treatmentController = new TreatmentController();
