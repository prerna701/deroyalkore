import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/', requireAdmin, appointmentController.list);
router.post('/', appointmentController.create);
router.patch('/:id/status', requireAdmin, appointmentController.updateStatus);

export default router;
