import { Router } from 'express';
import { beforeAfterController } from '../controllers/beforeAfter.controller';
import { beforeAfterUpload } from '../middlewares/beforeAfterUpload';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', beforeAfterController.list);
router.put('/:id',
  requireAdmin,
  beforeAfterUpload.any(),
  beforeAfterController.update);
router.delete('/:id', requireAdmin, beforeAfterController.delete);
router.post(
  '/',
  requireAdmin,
  beforeAfterUpload.any(),
  beforeAfterController.create,
);

export default router;
