import { Router } from 'express';
import { galleryController } from '../controllers/gallery.controller';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', galleryController.list);
router.get('/:id', galleryController.getById);
router.post('/', requireAdmin, galleryController.create);
router.put('/:id', requireAdmin, galleryController.update);
router.delete('/:id', requireAdmin, galleryController.delete);

export default router;
