import { Router } from 'express';
import { beforeAfterController } from '../controllers/beforeAfter.controller';
import { beforeAfterUpload } from '../middlewares/beforeAfterUpload';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', beforeAfterController.list);
router.put('/:id',
  requireAdmin,
  beforeAfterUpload.fields([
    { name: 'before', maxCount: 1 },
    { name: 'after', maxCount: 1 },
  ]),
  beforeAfterController.update);
router.delete('/:id', requireAdmin, beforeAfterController.delete);
router.post(
  '/',
  requireAdmin,
  beforeAfterUpload.fields([
    { name: 'before', maxCount: 1 },
    { name: 'after', maxCount: 1 },
  ]),
  beforeAfterController.create,
);

export default router;
