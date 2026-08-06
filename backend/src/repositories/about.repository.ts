import { randomUUID } from 'crypto';
import { getCollection } from '../config/mongo';

export interface AboutRecord {
  id: string;
  badge: string;
  badgeLabel: string;
  tagline: string;
  titlePrefix: string;
  titleSuffix: string;
  paragraphs: string[];
  buttonText: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAboutInput {
  badge: string;
  badgeLabel: string;
  tagline: string;
  titlePrefix: string;
  titleSuffix: string;
  paragraphs: string[];
  buttonText: string;
  images: string[];
}

export interface UpdateAboutInput {
  badge?: string;
  badgeLabel?: string;
  tagline?: string;
  titlePrefix?: string;
  titleSuffix?: string;
  paragraphs?: string[];
  buttonText?: string;
  images?: string[];
}

const COLLECTION_NAME = 'about';

class AboutRepository {
  async findAll(): Promise<AboutRecord[]> {
    const collection = await getCollection<AboutRecord>(COLLECTION_NAME);
    return collection.find({}, { projection: { _id: 0 } }).sort({ updatedAt: -1 }).toArray();
  }

  async findById(id: string): Promise<AboutRecord | undefined> {
    const collection = await getCollection<AboutRecord>(COLLECTION_NAME);
    return collection.findOne({ id }, { projection: { _id: 0 } }) as Promise<AboutRecord | undefined>;
  }

  async create(input: CreateAboutInput): Promise<AboutRecord> {
    const now = new Date().toISOString();
    const record: AboutRecord = {
      id: randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getCollection<AboutRecord>(COLLECTION_NAME);
    await collection.insertOne(record as AboutRecord);
    return record;
  }

  async update(id: string, input: UpdateAboutInput): Promise<AboutRecord | undefined> {
    const collection = await getCollection<AboutRecord>(COLLECTION_NAME);
    const updatePayload = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ) as Partial<AboutRecord>;

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { ...updatePayload, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after', projection: { _id: 0 } },
    );

    return result as AboutRecord | undefined;
  }

  async delete(id: string): Promise<boolean> {
    const collection = await getCollection<AboutRecord>(COLLECTION_NAME);
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

export const aboutRepository = new AboutRepository();
