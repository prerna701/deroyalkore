import { Router } from 'express';
import authRoutes from './auth.routes';
import beforeAfterRoutes from './beforeAfter.routes';
import userRoutes from './user.routes';
import treatmentRoutes from './treatment.routes';
import faqRoutes from './faq.routes';
import aboutRoutes from './about.routes';
import contactRoutes from './contact.routes';
import galleryRoutes from './gallery.routes';
import { ApiResponse } from '../utils/ApiResponse';
import { requireAdmin } from '../middlewares/requireAdmin';

/**
 * All feature routers get mounted here, then this single router is
 * mounted once in app.ts under the API_PREFIX (e.g. /api/v1).
 *
 * ADD A NEW MODULE like this:
 *   import productRoutes from './product.routes';
 *   router.use('/products', productRoutes);
 */
const router = Router();

router.get('/health', (_req, res) => {
  ApiResponse.ok(res, { uptime: process.uptime() }, 'Service is healthy');
});

router.use('/auth', authRoutes);
router.use('/before-after', beforeAfterRoutes);
router.use('/users', requireAdmin, userRoutes);
router.use('/treatments', treatmentRoutes);
router.use('/faqs', faqRoutes);
router.use('/about', aboutRoutes);
router.use('/contact', contactRoutes);
router.use('/gallery', galleryRoutes);

export default router;
