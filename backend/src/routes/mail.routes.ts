import { Router } from 'express';
import { sendAppointmentConfirmationEmail } from '../utils/mailer';

const router = Router();

router.post('/test', async (req, res) => {
  const { email, name = 'Guest' } = req.body ?? {};

  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required' });
    return;
  }

  const result = await sendAppointmentConfirmationEmail({
    to: email,
    name,
    treatmentName: 'Consultation',
    preferredDate: '2026-08-03',
    preferredTime: '10:30 AM',
  });

  res.json({ success: true, data: result });
});

export default router;
