import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS
    ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      }
    : undefined,
});

export async function sendAppointmentConfirmationEmail(payload: {
  to: string;
  name: string;
  treatmentName: string;
  preferredDate: string;
  preferredTime: string;
}) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return { ok: false, skipped: true, reason: 'smtp-not-configured' };
  }

  const from = env.SMTP_FROM || env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: payload.to,
    subject: 'Appointment confirmation - Krish Skin Clinic',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2d2d2d;">
        <h2>Appointment Received</h2>
        <p>Hi ${payload.name},</p>
        <p>Thank you for booking your consultation with Krish Skin Clinic. We have received your request for <strong>${payload.treatmentName}</strong>.</p>
        <p><strong>Preferred date:</strong> ${payload.preferredDate}<br />
        <strong>Preferred time:</strong> ${payload.preferredTime}</p>
        <p>Our team will contact you shortly to confirm the slot.</p>
      </div>
    `,
  });

  return { ok: true, skipped: false };
}
