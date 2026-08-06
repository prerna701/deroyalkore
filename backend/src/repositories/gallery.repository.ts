import { randomUUID } from 'crypto';
import { getCollection } from '../config/mongo';

export interface GalleryRecord {
  id: string;
  title: string;
  titleSuffix: string;
  subtitle: string;
  note: string;
  images: GalleryImage[];
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  sortOrder: number;
}

export interface CreateGalleryInput {
  title: string;
  titleSuffix: string;
  subtitle: string;
  note: string;
  images: GalleryImage[];
}

export interface UpdateGalleryInput {
  title?: string;
  titleSuffix?: string;
  subtitle?: string;
  note?: string;
  images?: GalleryImage[];
}

const COLLECTION_NAME = 'galleries';

class GalleryRepository {
  async findAll(): Promise<GalleryRecord[]> {
    const collection = await getCollection<GalleryRecord>(COLLECTION_NAME);
    return collection.find({}, { projection: { _id: 0 } }).sort({ updatedAt: -1 }).toArray();
  }

  async findById(id: string): Promise<GalleryRecord | undefined> {
    const collection = await getCollection<GalleryRecord>(COLLECTION_NAME);
    return collection.findOne({ id }, { projection: { _id: 0 } }) as Promise<GalleryRecord | undefined>;
  }

  async create(input: CreateGalleryInput): Promise<GalleryRecord> {
    const now = new Date().toISOString();
    const record: GalleryRecord = {
      id: randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getCollection<GalleryRecord>(COLLECTION_NAME);
    await collection.insertOne(record as GalleryRecord);
    return record;
  }

  async update(id: string, input: UpdateGalleryInput): Promise<GalleryRecord | undefined> {
    const collection = await getCollection<GalleryRecord>(COLLECTION_NAME);
    const updatePayload = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ) as Partial<GalleryRecord>;

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { ...updatePayload, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after', projection: { _id: 0 } },
    );

    return result as GalleryRecord | undefined;
  }

  async delete(id: string): Promise<boolean> {
    const collection = await getCollection<GalleryRecord>(COLLECTION_NAME);
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

export const galleryRepository = new GalleryRepository();
