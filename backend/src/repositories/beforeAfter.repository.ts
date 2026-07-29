import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

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

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'before-after-cases.json');

class BeforeAfterRepository {
  private cases: BeforeAfterCaseRecord[] = [];

  constructor() {
    this.load();
  }

  async findAll(): Promise<BeforeAfterCaseRecord[]> {
    return [...this.cases].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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

    this.cases.push(record);
    await this.save();

    return record;
  }

  private load() {
    fs.mkdirSync(dataDir, { recursive: true });

    if (!fs.existsSync(dataFile)) {
      this.cases = [];
      return;
    }

    const raw = fs.readFileSync(dataFile, 'utf8');
    const parsed = JSON.parse(raw) as BeforeAfterCaseRecord[];
    this.cases = Array.isArray(parsed) ? parsed : [];
  }

  private async save() {
    await fs.promises.mkdir(dataDir, { recursive: true });
    await fs.promises.writeFile(dataFile, JSON.stringify(this.cases, null, 2), 'utf8');
  }
}

export const beforeAfterRepository = new BeforeAfterRepository();
