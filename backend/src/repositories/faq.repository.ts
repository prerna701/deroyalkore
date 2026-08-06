import { randomUUID } from 'crypto';
import { PaginationMeta } from '../types/common.types';
import { buildPaginationMeta } from '../utils/pagination';
import { getCollection } from '../config/mongo';

export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqInput {
  question: string;
  answer: string;
}

export interface UpdateFaqInput {
  question?: string;
  answer?: string;
}

export interface FaqPaginationResult {
  items: FaqRecord[];
  meta: PaginationMeta;
}

export interface FaqRepository {
  create(input: CreateFaqInput): Promise<FaqRecord>;
  findAllWithPagination(page: number, limit: number): Promise<FaqPaginationResult>;
  findById(id: string): Promise<FaqRecord | null>;
  update(id: string, input: UpdateFaqInput): Promise<FaqRecord | undefined>;
  delete(id: string): Promise<boolean>;
}

const COLLECTION_NAME = 'faqs';

class FaqMongoRepository implements FaqRepository {
  async create(input: CreateFaqInput): Promise<FaqRecord> {
    const now = new Date().toISOString();
    const record: FaqRecord = {
      id: `faq-${randomUUID()}`,
      question: input.question.trim(),
      answer: input.answer.trim(),
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getCollection<FaqRecord>(COLLECTION_NAME);
    await collection.insertOne(record as FaqRecord);
    return record;
  }

  async findAllWithPagination(page = 1, limit = 10): Promise<FaqPaginationResult> {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const collection = await getCollection<FaqRecord>(COLLECTION_NAME);

    const [items, totalItems] = await Promise.all([
      collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).toArray(),
      collection.countDocuments(),
    ]);

    const meta = buildPaginationMeta(totalItems, safePage, safeLimit);
    return { items, meta };
  }

  async findById(id: string): Promise<FaqRecord | null> {
    const collection = await getCollection<FaqRecord>(COLLECTION_NAME);
    return collection.findOne({ id }, { projection: { _id: 0 } }) as Promise<FaqRecord | null>;
  }

  async update(id: string, input: UpdateFaqInput): Promise<FaqRecord | undefined> {
    const collection = await getCollection<FaqRecord>(COLLECTION_NAME);
    const updatePayload = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ) as Partial<FaqRecord>;

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { ...updatePayload, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after', projection: { _id: 0 } },
    );

    return result as FaqRecord | undefined;
  }

  async delete(id: string): Promise<boolean> {
    const collection = await getCollection<FaqRecord>(COLLECTION_NAME);
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

export const faqRepository = new FaqMongoRepository();
