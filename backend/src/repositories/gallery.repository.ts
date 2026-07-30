import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

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

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'gallery.json');

const defaultGallery: CreateGalleryInput = {
  title: 'Clinical',
  titleSuffix: 'Gallery',
  subtitle: 'Experience The Luxury',
  note: 'World-Class Infrastructure - Advanced Skin Technology - Luxury Care',
  images: [
    { id: randomUUID(), url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80', title: 'Modern Consultation Room', sortOrder: 1 },
    { id: randomUUID(), url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80', title: 'Advanced Treatment Suite', sortOrder: 2 },
    { id: randomUUID(), url: 'https://images.unsplash.com/photo-1586773860418-d3b9a8ec862e?auto=format&fit=crop&q=80', title: 'Luxury Reception', sortOrder: 3 },
    { id: randomUUID(), url: 'https://images.unsplash.com/photo-1600334129128-ec85758fd30d?auto=format&fit=crop&q=80', title: 'Waitng Lounge', sortOrder: 4 },
    { id: randomUUID(), url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80', title: 'Sterile Procedure Room', sortOrder: 5 },
    { id: randomUUID(), url: 'https://images.unsplash.com/photo-1631217812030-802525166299?auto=format&fit=crop&q=80', title: 'Laser Technology Booth', sortOrder: 6 },
  ],
};

class GalleryRepository {
  private records: GalleryRecord[] = [];

  constructor() {
    this.load();
  }

  async findAll(): Promise<GalleryRecord[]> {
    return [...this.records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async findById(id: string): Promise<GalleryRecord | undefined> {
    return this.records.find((record) => record.id === id);
  }

  async create(input: CreateGalleryInput): Promise<GalleryRecord> {
    const now = new Date().toISOString();
    const record: GalleryRecord = {
      id: randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    this.records.unshift(record);
    await this.save();
    return record;
  }

  async update(id: string, input: UpdateGalleryInput): Promise<GalleryRecord | undefined> {
    const index = this.records.findIndex((record) => record.id === id);
    if (index === -1) return undefined;

    const updatedRecord: GalleryRecord = {
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

  private createDefaultRecord(): GalleryRecord {
    const now = new Date().toISOString();
    return {
      id: randomUUID(),
      ...defaultGallery,
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
      const parsed = JSON.parse(raw) as GalleryRecord[];
      this.records = Array.isArray(parsed) && parsed.length > 0 ? parsed : [this.createDefaultRecord()];
    } catch (error) {
      console.error('Failed to parse gallery.json', error);
      this.records = [this.createDefaultRecord()];
    }
  }

  private async save() {
    await fs.promises.mkdir(dataDir, { recursive: true });
    await fs.promises.writeFile(dataFile, JSON.stringify(this.records, null, 2), 'utf8');
  }
}

export const galleryRepository = new GalleryRepository();
