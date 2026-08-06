import { randomUUID } from 'crypto';
import { getCollection } from '../config/mongo';

export interface TreatmentRecord {
  id: string;
  slug: string;
  title: string;
  about: string;
  sessions: string;
  price: string;
  duration: string;
  protocol: string;
  bestFor: string[];
  benefits: string[];
  image: string;
  discountPrice?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreatmentInput {
  title: string;
  about: string;
  sessions: string;
  price: string;
  duration: string;
  protocol: string;
  bestFor: string[];
  benefits: string[];
  image: string;
  discountPrice?: string;
}

export interface UpdateTreatmentInput {
  title?: string;
  about?: string;
  sessions?: string;
  price?: string;
  duration?: string;
  protocol?: string;
  bestFor?: string[];
  benefits?: string[];
  image?: string;
  discountPrice?: string;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const COLLECTION_NAME = 'treatments';

class TreatmentRepository {
  async findAll(): Promise<TreatmentRecord[]> {
    const collection = await getCollection<TreatmentRecord>(COLLECTION_NAME);
    return collection
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async findById(id: string): Promise<TreatmentRecord | undefined> {
    const collection = await getCollection<TreatmentRecord>(COLLECTION_NAME);
    return collection.findOne({ id }, { projection: { _id: 0 } }) as Promise<TreatmentRecord | undefined>;
  }

  async findBySlug(slug: string): Promise<TreatmentRecord | undefined> {
    const collection = await getCollection<TreatmentRecord>(COLLECTION_NAME);
    return collection.findOne({ slug }, { projection: { _id: 0 } }) as Promise<TreatmentRecord | undefined>;
  }

  async create(input: CreateTreatmentInput): Promise<TreatmentRecord> {
    const now = new Date().toISOString();
    const record: TreatmentRecord = {
      id: randomUUID(),
      slug: slugify(input.title),
      title: input.title,
      about: input.about,
      sessions: input.sessions,
      price: input.price,
      duration: input.duration,
      protocol: input.protocol,
      bestFor: input.bestFor,
      benefits: input.benefits,
      image: input.image,
      discountPrice: input.discountPrice,
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getCollection<TreatmentRecord>(COLLECTION_NAME);
    await collection.insertOne(record as TreatmentRecord);
    return record;
  }

  async update(id: string, input: UpdateTreatmentInput): Promise<TreatmentRecord | undefined> {
    const collection = await getCollection<TreatmentRecord>(COLLECTION_NAME);
    const updatePayload = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ) as Partial<TreatmentRecord>;

    const next = {
      ...updatePayload,
      slug: input.title ? slugify(input.title) : undefined,
      updatedAt: new Date().toISOString(),
    };

    const sanitized = Object.fromEntries(Object.entries(next).filter(([, value]) => value !== undefined));

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: sanitized },
      { returnDocument: 'after', projection: { _id: 0 } },
    );

    return result as TreatmentRecord | undefined;
  }

  async delete(id: string): Promise<boolean> {
    const collection = await getCollection<TreatmentRecord>(COLLECTION_NAME);
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

export const treatmentRepository = new TreatmentRepository();
