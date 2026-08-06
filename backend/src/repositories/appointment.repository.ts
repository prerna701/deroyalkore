import { randomUUID } from 'crypto';
import { getCollection } from '../config/mongo';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface AppointmentRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  treatmentId: string;
  treatmentName: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentInput {
  name: string;
  phone: string;
  email: string;
  treatmentId: string;
  treatmentName: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status?: AppointmentStatus;
}

export interface UpdateAppointmentStatusInput {
  status: AppointmentStatus;
}

const COLLECTION_NAME = 'appointments';

class AppointmentRepository {
  async findAll(): Promise<AppointmentRecord[]> {
    const collection = await getCollection<AppointmentRecord>(COLLECTION_NAME);
    return collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
  }

  async findByDateTime(preferredDate: string, preferredTime: string): Promise<AppointmentRecord | null> {
    const collection = await getCollection<AppointmentRecord>(COLLECTION_NAME);
    return collection.findOne({ preferredDate, preferredTime }, { projection: { _id: 0 } });
  }

  async findByEmailOrPhone(email: string, phone: string): Promise<AppointmentRecord | null> {
    const collection = await getCollection<AppointmentRecord>(COLLECTION_NAME);
    return collection.findOne({ $or: [{ email }, { phone }] }, { projection: { _id: 0 }, sort: { createdAt: -1 } });
  }

  async create(input: CreateAppointmentInput): Promise<AppointmentRecord> {
    const now = new Date().toISOString();
    const record: AppointmentRecord = {
      id: randomUUID(),
      name: input.name,
      phone: input.phone,
      email: input.email,
      treatmentId: input.treatmentId,
      treatmentName: input.treatmentName,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      message: input.message ?? '',
      
      status: input.status ?? 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getCollection<AppointmentRecord>(COLLECTION_NAME);
    await collection.insertOne(record as AppointmentRecord);
    return record;
  }

  async updateStatus(id: string, input: UpdateAppointmentStatusInput): Promise<AppointmentRecord | undefined> {
    const collection = await getCollection<AppointmentRecord>(COLLECTION_NAME);
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { status: input.status, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after', projection: { _id: 0 } },
    );

    return result as AppointmentRecord | undefined;
  }
}

export const appointmentRepository = new AppointmentRepository();
