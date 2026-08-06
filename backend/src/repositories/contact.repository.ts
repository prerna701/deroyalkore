import { randomUUID } from 'crypto';
import { getCollection } from '../config/mongo';

export interface ContactTiming {
  label: string;
  value: string;
  isClosed?: boolean;
}

export interface ContactRecord {
  id: string;
  heading: string;
  address: string;
  phone: string;
  website: string;
  mapLink: string;
  timings: ContactTiming[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  heading: string;
  address: string;
  phone: string;
  website: string;
  mapLink: string;
  timings: ContactTiming[];
}

export interface UpdateContactInput {
  heading?: string;
  address?: string;
  phone?: string;
  website?: string;
  mapLink?: string;
  timings?: ContactTiming[];
}

const COLLECTION_NAME = 'contacts';

class ContactRepository {
  async findAll(): Promise<ContactRecord[]> {
    const collection = await getCollection<ContactRecord>(COLLECTION_NAME);
    return collection.find({}, { projection: { _id: 0 } }).sort({ updatedAt: -1 }).toArray();
  }

  async findById(id: string): Promise<ContactRecord | undefined> {
    const collection = await getCollection<ContactRecord>(COLLECTION_NAME);
    return collection.findOne({ id }, { projection: { _id: 0 } }) as Promise<ContactRecord | undefined>;
  }

  async create(input: CreateContactInput): Promise<ContactRecord> {
    const now = new Date().toISOString();
    const record: ContactRecord = {
      id: randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getCollection<ContactRecord>(COLLECTION_NAME);
    await collection.insertOne(record as ContactRecord);
    return record;
  }

  async update(id: string, input: UpdateContactInput): Promise<ContactRecord | undefined> {
    const collection = await getCollection<ContactRecord>(COLLECTION_NAME);
    const updatePayload = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ) as Partial<ContactRecord>;

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { ...updatePayload, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after', projection: { _id: 0 } },
    );

    return result as ContactRecord | undefined;
  }

  async delete(id: string): Promise<boolean> {
    const collection = await getCollection<ContactRecord>(COLLECTION_NAME);
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

export const contactRepository = new ContactRepository();
