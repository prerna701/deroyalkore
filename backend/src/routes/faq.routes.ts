import { Router } from 'express';
import { faqController } from '../controllers/faq.controller';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', faqController.list);
router.post('/', requireAdmin, faqController.create);
router.put('/:id', requireAdmin, faqController.update);
router.delete('/:id', requireAdmin, faqController.delete);

export default router;
