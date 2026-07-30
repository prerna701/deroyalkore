import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

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

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'about.json');

const defaultAbout: CreateAboutInput = {
  badge: '10+',
  badgeLabel: 'Year of Experience',
  tagline: 'About The Royal Core',
  titlePrefix: 'Top-Rated Skin Clinic in',
  titleSuffix: 'Panipat, Karnal',
  paragraphs: [
    'The Royal Core is a leading dermatology and laser clinic in Panipat and Karnal, led by Dr. Manpreet Kaur (MBBS AIIMS Delhi, MD Dermatology, PGI), a highly trusted dermatologist in Mohali and experienced skin specialist.',
    'Established in 2016, the clinic stands tall in Mohali, renowned for unparalleled patient satisfaction, exceptional services, and modern infrastructure.',
    'The Royal Core provide advanced treatment for acne, acne scars, pigmentation, melasma, hair fall, CO2 laser treatment, laser hair reduction, and other dermatological conditions.',
    'Equipped with advanced laser technology, The Royal Core is the preferred choice for patients searching for a reliable skin doctor or dermatologist in Panipat/Karnal.',
  ],
  buttonText: 'Read More',
  images: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80',
  ],
};

class AboutRepository {
  private records: AboutRecord[] = [];

  constructor() {
    this.load();
  }

  async findAll(): Promise<AboutRecord[]> {
    return [...this.records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async findById(id: string): Promise<AboutRecord | undefined> {
    return this.records.find((record) => record.id === id);
  }

  async create(input: CreateAboutInput): Promise<AboutRecord> {
    const now = new Date().toISOString();
    const record: AboutRecord = {
      id: randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    this.records.unshift(record);
    await this.save();
    return record;
  }

  async update(id: string, input: UpdateAboutInput): Promise<AboutRecord | undefined> {
    const index = this.records.findIndex((record) => record.id === id);
    if (index === -1) return undefined;

    const updatedRecord: AboutRecord = {
      ...this.records[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.records[index] = updatedRecord;
    await this.save();
    return updatedRecord;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.records.length;
    this.records = this.records.filter((record) => record.id !== id);

    if (this.records.length < initialLength) {
      await this.save();
      return true;
    }

    return false;
  }

  private createDefaultRecord(): AboutRecord {
    const now = new Date().toISOString();
    return {
      id: randomUUID(),
      ...defaultAbout,
      createdAt: now,
      updatedAt: now,
    };
  }

  private load() {
    fs.mkdirSync(dataDir, { recursive: true });

    if (!fs.existsSync(dataFile)) {
      this.records = [this.createDefaultRecord()];
      fs.writeFileSync(dataFile, JSON.stringify(this.records, null, 2), 'utf8');
      return;
    }

    try {
      const raw = fs.readFileSync(dataFile, 'utf8');
      const parsed = JSON.parse(raw) as AboutRecord[];
      this.records = Array.isArray(parsed) && parsed.length > 0 ? parsed : [this.createDefaultRecord()];
    } catch (error) {
      console.error('Failed to parse about.json', error);
      this.records = [this.createDefaultRecord()];
    }
  }

  private async save() {
    await fs.promises.mkdir(dataDir, { recursive: true });
    await fs.promises.writeFile(dataFile, JSON.stringify(this.records, null, 2), 'utf8');
  }
}

export const aboutRepository = new AboutRepository();
