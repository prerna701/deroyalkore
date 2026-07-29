import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

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
}

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'treatments.json');

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

class TreatmentRepository {
  private treatments: TreatmentRecord[] = [];

  constructor() {
    this.load();
  }

  async findAll(): Promise<TreatmentRecord[]> {
    return [...this.treatments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  
  async findById(id: string): Promise<TreatmentRecord | undefined> {
    return this.treatments.find(t => t.id === id);
  }

  async findBySlug(slug: string): Promise<TreatmentRecord | undefined> {
    return this.treatments.find(t => t.slug === slug);
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
      createdAt: now,
      updatedAt: now,
    };

    this.treatments.push(record);
    await this.save();

    return record;
  }
  
  async update(id: string, input: UpdateTreatmentInput): Promise<TreatmentRecord | undefined> {
    const index = this.treatments.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    const record = this.treatments[index];
    const updatedRecord: TreatmentRecord = {
      ...record,
      ...input,
      slug: input.title ? slugify(input.title) : record.slug,
      updatedAt: new Date().toISOString()
    };
    
    this.treatments[index] = updatedRecord;
    await this.save();
    return updatedRecord;
  }
  
  async delete(id: string): Promise<boolean> {
    const initialLength = this.treatments.length;
    this.treatments = this.treatments.filter(t => t.id !== id);
    
    if (this.treatments.length < initialLength) {
        await this.save();
        return true;
    }
    return false;
  }

  private load() {
    fs.mkdirSync(dataDir, { recursive: true });

    if (!fs.existsSync(dataFile)) {
      this.treatments = [];
      return;
    }

    try {
        const raw = fs.readFileSync(dataFile, 'utf8');
        const parsed = JSON.parse(raw) as TreatmentRecord[];
        this.treatments = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("Failed to parse treatments.json", e);
        this.treatments = [];
    }
  }

  private async save() {
    await fs.promises.mkdir(dataDir, { recursive: true });
    await fs.promises.writeFile(dataFile, JSON.stringify(this.treatments, null, 2), 'utf8');
  }
}

export const treatmentRepository = new TreatmentRepository();
