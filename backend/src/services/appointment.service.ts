import { ApiError } from '../utils/ApiError';
import { appointmentRepository, type AppointmentRecord, type CreateAppointmentInput, type UpdateAppointmentStatusInput } from '../repositories/appointment.repository';
import { sendAppointmentConfirmationEmail } from '../utils/mailer';

export interface AppointmentResponse extends AppointmentRecord {}

export function normalizeAppointmentInput(input: Record<string, unknown>): CreateAppointmentInput {
  const name = String(input.name ?? '').trim();
  const phone = String(input.phone ?? '').trim();
  const email = String(input.email ?? '').trim();
  const treatmentId = String(input.treatmentId ?? '').trim();
  const treatmentName = String(input.treatmentName ?? '').trim();
  const preferredDate = String(input.preferredDate ?? '').trim();
  const preferredTime = String(input.preferredTime ?? '').trim();
  const message = String(input.message ?? '').trim();

  if (!name || !phone || !email || !treatmentId || !treatmentName || !preferredDate || !preferredTime) {
    throw ApiError.badRequest('Name, phone, email, treatment, preferred date, and preferred time are required');
  }

  return {
    name,
    phone,
    email,
    treatmentId,
    treatmentName,
    preferredDate,
    preferredTime,
    message,
    status: 'pending',
  };
}

class AppointmentService {
  async getAll(): Promise<AppointmentResponse[]> {
    return appointmentRepository.findAll();
  }

  async create(input: Record<string, unknown>): Promise<AppointmentResponse> {
    const normalized = normalizeAppointmentInput(input);
    
    // Check for double booking of the time slot
    const existingSlot = await appointmentRepository.findByDateTime(normalized.preferredDate, normalized.preferredTime);
    if (existingSlot && existingSlot.status !== 'cancelled') {
      throw ApiError.conflict('This appointment slot is already taken. Please choose a different date or time.');
    }

    // Check if the user already has an active appointment
    const existingUser = await appointmentRepository.findByEmailOrPhone(normalized.email, normalized.phone);
    if (existingUser && existingUser.status !== 'cancelled') {
      throw ApiError.conflict('An active appointment already exists for this email or phone number.');
    }

    const record = await appointmentRepository.create(normalized);

    try {
      await sendAppointmentConfirmationEmail({
        to: normalized.email,
        name: normalized.name,
        treatmentName: normalized.treatmentName,
        preferredDate: normalized.preferredDate,
        preferredTime: normalized.preferredTime,
      });
    } catch (error) {
      console.error('Appointment email failed', error);
    }

    return record;
  }

  async updateStatus(id: string, input: UpdateAppointmentStatusInput): Promise<AppointmentResponse> {
    const appointment = await appointmentRepository.updateStatus(id, input);
    if (!appointment) {
      throw ApiError.notFound('Appointment not found');
    }
    return appointment;
  }
}

export const appointmentService = new AppointmentService();
