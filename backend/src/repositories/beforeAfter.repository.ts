import { randomUUID } from 'crypto';
import { getCollection } from '../config/mongo';

export interface BeforeAfterCaseRecord {
  id: string;
  category: string;
  label: string;
  beforePath: string;
  afterPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeforeAfterCaseInput {
  category: string;
  label: string;
  beforePath: string;
  afterPath: string;
}

const COLLECTION_NAME = 'beforeAfterCases';

class BeforeAfterRepository {
  async findAll(): Promise<BeforeAfterCaseRecord[]> {
    const collection = await getCollection<BeforeAfterCaseRecord>(COLLECTION_NAME);
    return collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
  }

  async create(input: CreateBeforeAfterCaseInput): Promise<BeforeAfterCaseRecord> {
    const now = new Date().toISOString();
    const record: BeforeAfterCaseRecord = {
      id: randomUUID(),
      category: input.category,
      label: input.label,
      beforePath: input.beforePath,
      afterPath: input.afterPath,
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getCollection<BeforeAfterCaseRecord>(COLLECTION_NAME);
    await collection.insertOne(record as BeforeAfterCaseRecord);
    return record;
  }
}

export const beforeAfterRepository = new BeforeAfterRepository();
