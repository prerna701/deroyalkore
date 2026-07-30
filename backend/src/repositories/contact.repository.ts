import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

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

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'contact.json');

const defaultContact: CreateContactInput = {
  heading: 'Contact Us!',
  address: 'House No. 142, Near Sports Complex, Sector 78, Sahibzada Ajit Singh Nagar, Punjab 140308',
  phone: '+91-70870-00365',
  website: 'www.zivaskinclinic.com',
  mapLink: '#',
  timings: [
    { label: 'Mon - Tue', value: '10:00am to 2:00pm & 4:00pm to 7:00pm' },
    { label: 'Wednesday', value: 'Closed', isClosed: true },
    { label: 'Thu - Sat', value: '10:00am to 2:00pm & 4:00pm to 7:00pm' },
    { label: 'Sunday', value: '11:00am to 2:00pm' },
  ],
};

class ContactRepository {
  private records: ContactRecord[] = [];

  constructor() {
    this.load();
  }

  async findAll(): Promise<ContactRecord[]> {
    return [...this.records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async findById(id: string): Promise<ContactRecord | undefined> {
    return this.records.find((record) => record.id === id);
  }

  async create(input: CreateContactInput): Promise<ContactRecord> {
    const now = new Date().toISOString();
    const record: ContactRecord = {
      id: randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    this.records.unshift(record);
    await this.save();
    return record;
  }

  async update(id: string, input: UpdateContactInput): Promise<ContactRecord | undefined> {
    const index = this.records.findIndex((record) => record.id === id);
    if (index === -1) return undefined;

    const updatedRecord: ContactRecord = {
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

  private createDefaultRecord(): ContactRecord {
    const now = new Date().toISOString();
    return {
      id: randomUUID(),
      ...defaultContact,
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
      const parsed = JSON.parse(raw) as ContactRecord[];
      this.records = Array.isArray(parsed) && parsed.length > 0 ? parsed : [this.createDefaultRecord()];
    } catch (error) {
      console.error('Failed to parse contact.json', error);
      this.records = [this.createDefaultRecord()];
    }
  }

  private async save() {
    await fs.promises.mkdir(dataDir, { recursive: true });
    await fs.promises.writeFile(dataFile, JSON.stringify(this.records, null, 2), 'utf8');
  }
}

export const contactRepository = new ContactRepository();
