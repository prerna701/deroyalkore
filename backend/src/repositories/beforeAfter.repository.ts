import { randomUUID } from 'crypto';
import { getCollection } from '../config/mongo';

export interface BeforeAfterCaseRecord {
  id: string;

  label: string;
  beforePath: string;
  afterPath: string;
  treatmentIds: string[]; // New field to store associated treatment IDs (multiple)
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeforeAfterCaseInput {

  label: string;
  beforePath: string;
  afterPath: string;
  treatmentIds: string[]; // New field for creating case with multiple treatments
}

const COLLECTION_NAME = 'beforeAfterCases';

class BeforeAfterRepository {
  async findAll(): Promise<BeforeAfterCaseRecord[]> {
    const collection = await getCollection<BeforeAfterCaseRecord>(COLLECTION_NAME);
    return collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
  }

  async findById(id: string): Promise<BeforeAfterCaseRecord | null> {
    const collection = await getCollection<BeforeAfterCaseRecord>(COLLECTION_NAME);
    return collection.findOne({ id }, { projection: { _id: 0 } });
  }

  async update(id: string, update: Partial<CreateBeforeAfterCaseInput & { treatmentIds?: string[] }>): Promise<BeforeAfterCaseRecord> {
    const collection = await getCollection<BeforeAfterCaseRecord>(COLLECTION_NAME);
    const now = new Date().toISOString();
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { ...update, updatedAt: now } },
      { returnDocument: 'after', projection: { _id: 0 } },
    );
    if (!result) {
      throw new Error('Record not found');
    }
    return result;
  }

  async delete(id: string): Promise<void> {
    const collection = await getCollection<BeforeAfterCaseRecord>(COLLECTION_NAME);
    await collection.deleteOne({ id });
  }

  async create(input: CreateBeforeAfterCaseInput): Promise<BeforeAfterCaseRecord> {
    const now = new Date().toISOString();
    const record: BeforeAfterCaseRecord = {
      id: randomUUID(),

      label: input.label,
      beforePath: input.beforePath,
      afterPath: input.afterPath,
      treatmentIds: input.treatmentIds,
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getCollection<BeforeAfterCaseRecord>(COLLECTION_NAME);
    await collection.insertOne(record as BeforeAfterCaseRecord);
    return record;
  }
}

export const beforeAfterRepository = new BeforeAfterRepository();
