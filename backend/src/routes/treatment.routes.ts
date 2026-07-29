import { Router } from 'express';
import { treatmentController } from '../controllers/treatment.controller';
import { treatmentsUpload } from '../middlewares/treatmentsUpload';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', treatmentController.list);
router.get('/:id', treatmentController.getByIdOrSlug);

router.post(
  '/',
  requireAdmin,
  treatmentsUpload.fields([
    { name: 'image', maxCount: 1 },
  ]),
  treatmentController.create,
);

router.put(
  '/:id',
  requireAdmin,
  treatmentsUpload.fields([
    { name: 'image', maxCount: 1 },
  ]),
  treatmentController.update,
);

router.delete('/:id', requireAdmin, treatmentController.delete);

export default router;
