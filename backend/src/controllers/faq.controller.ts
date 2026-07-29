import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { faqService } from '../services/faq.service';
import { type CreateFaqInput, type UpdateFaqInput } from '../repositories/faq.repository';

class FaqController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await faqService.getFaqs(page, limit);

    ApiResponse.paginated(
      res,
      result.items,
      result.meta,
      'FAQs fetched successfully',
    );
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const faq = await faqService.createFaq(req.body as CreateFaqInput);
    ApiResponse.created(res, faq, 'FAQ created successfully');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const faq = await faqService.updateFaq(req.params.id, req.body as UpdateFaqInput);
    ApiResponse.ok(res, faq, 'FAQ updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await faqService.deleteFaq(req.params.id);
    ApiResponse.ok(res, null, 'FAQ deleted successfully');
  });
}

export const faqController = new FaqController();
