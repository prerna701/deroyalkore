import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', contactController.list);
router.get('/:id', contactController.getById);
router.post('/', requireAdmin, contactController.create);
router.put('/:id', requireAdmin, contactController.update);
router.delete('/:id', requireAdmin, contactController.delete);

export default router;
