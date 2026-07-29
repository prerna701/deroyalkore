import fs from 'fs';
import path from 'path';
import { PaginationMeta } from '../types/common.types';
import { buildPaginationMeta } from '../utils/pagination';

export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
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

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'faqs.json');

class FaqFileRepository implements FaqRepository {
  private faqs: FaqRecord[] = [];

  constructor() {
    this.load();
  }

  async create(input: CreateFaqInput): Promise<FaqRecord> {
    const record: FaqRecord = {
      id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      question: input.question.trim(),
      answer: input.answer.trim(),
    };

    this.faqs = [record, ...this.faqs];
    await this.save();
    return record;
  }

  async findAllWithPagination(page = 1, limit = 10): Promise<FaqPaginationResult> {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;

    const totalItems = this.faqs.length;
    const meta = buildPaginationMeta(totalItems, safePage, safeLimit);
    const startIndex = (meta.page - 1) * meta.limit;
    const endIndex = startIndex + meta.limit;

    return {
      items: this.faqs.slice(startIndex, endIndex),
      meta,
    };
  }

  async findById(id: string): Promise<FaqRecord | null> {
    return this.faqs.find((item) => item.id === id) ?? null;
  }

  async update(id: string, input: UpdateFaqInput): Promise<FaqRecord | undefined> {
    const index = this.faqs.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    const updatedRecord = {
      ...this.faqs[index],
      question: input.question?.trim() ?? this.faqs[index].question,
      answer: input.answer?.trim() ?? this.faqs[index].answer,
    };

    this.faqs[index] = updatedRecord;
    await this.save();
    return updatedRecord;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.faqs.length;
    this.faqs = this.faqs.filter((item) => item.id !== id);

    if (this.faqs.length < initialLength) {
      await this.save();
      return true;
    }

    return false;
  }

  private load() {
    fs.mkdirSync(dataDir, { recursive: true });

    if (!fs.existsSync(dataFile)) {
      this.faqs = [];
      return;
    }

    try {
      const raw = fs.readFileSync(dataFile, 'utf8');
      const parsed = JSON.parse(raw) as FaqRecord[];
      this.faqs = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse faqs.json', error);
      this.faqs = [];
    }
  }

  private async save() {
    await fs.promises.mkdir(dataDir, { recursive: true });
    await fs.promises.writeFile(dataFile, JSON.stringify(this.faqs, null, 2), 'utf8');
  }
}

export const faqRepository = new FaqFileRepository();
