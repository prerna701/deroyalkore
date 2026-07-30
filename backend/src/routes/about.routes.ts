import { Router } from 'express';
import { aboutController } from '../controllers/about.controller';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', aboutController.list);
router.get('/:id', aboutController.getById);
router.post('/', requireAdmin, aboutController.create);
router.put('/:id', requireAdmin, aboutController.update);
router.delete('/:id', requireAdmin, aboutController.delete);

export default router;
