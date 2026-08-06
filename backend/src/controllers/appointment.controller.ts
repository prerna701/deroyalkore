import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { appointmentService } from '../services/appointment.service';

class AppointmentController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const records = await appointmentService.getAll();
    ApiResponse.ok(res, records, 'Appointments fetched successfully');
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const record = await appointmentService.create(req.body);
    ApiResponse.created(res, record, 'Appointment created successfully');
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const record = await appointmentService.updateStatus(req.params.id, req.body);
    ApiResponse.ok(res, record, 'Appointment status updated successfully');
  });
}

export const appointmentController = new AppointmentController();
