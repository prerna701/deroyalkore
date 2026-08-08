import { Router } from 'express';
import { galleryController } from '../controllers/gallery.controller';
import { requireAdmin } from '../middlewares/requireAdmin';
import { galleryUpload } from '../middlewares/galleryUpload';

const router = Router();

router.get('/', galleryController.list);
router.get('/:id', galleryController.getById);

// Multi-image upload endpoint — must be before /:id to avoid route collision
router.post('/upload-images', requireAdmin, galleryUpload.array('images', 20), galleryController.uploadImages);

router.post('/', requireAdmin, galleryController.create);
router.put('/:id', requireAdmin, galleryController.update);
router.delete('/:id', requireAdmin, galleryController.delete);

export default router;
