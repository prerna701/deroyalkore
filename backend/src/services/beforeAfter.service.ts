import {
  beforeAfterRepository,
  BeforeAfterCaseRecord,
} from '../repositories/beforeAfter.repository';
import { ApiError } from '../utils/ApiError';

export interface BeforeAfterCaseResponse {
  _id: string;
  category: string;
  label: string;
  before: string;
  after: string;
  createdAt: string;
  updatedAt: string;
}

class BeforeAfterService {
  private toPublicUrl(value: string, baseUrl: string): string {
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    return `${baseUrl}${value}`;
  }

  private toResponseCase(record: BeforeAfterCaseRecord, baseUrl: string): BeforeAfterCaseResponse {
    return {
      _id: record.id,
      category: record.category,
      label: record.label,
      before: this.toPublicUrl(record.beforePath, baseUrl),
      after: this.toPublicUrl(record.afterPath, baseUrl),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private getTextField(body: Record<string, unknown> | undefined, keys: string[]): string {
    for (const key of keys) {
      const value = body?.[key];

      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
    return '';
  }

  async getAllCases(baseUrl: string): Promise<BeforeAfterCaseResponse[]> {
    const records = await beforeAfterRepository.findAll();
    return records.map(record => this.toResponseCase(record, baseUrl));
  }

  async createCase(
    body: Record<string, unknown>,
    files: { before?: Express.Multer.File[]; after?: Express.Multer.File[] } | undefined,
    baseUrl: string
  ): Promise<{ case: BeforeAfterCaseResponse; total: number }> {
    const category = this.getTextField(body, ['category', 'treatmentCategory', 'treatment']);
    const label = this.getTextField(body, ['label', 'title', 'name']);

    if (!category || !label) {
      throw ApiError.badRequest('Category and label are required', {
        receivedFields: Object.keys(body ?? {}),
        missing: {
          category: !category,
          label: !label,
        },
      });
    }

    const beforeFile = files?.before?.[0];
    const afterFile = files?.after?.[0];
    
    const beforeImage = beforeFile
      ? `/uploads/before-after/${beforeFile.filename}`
      : this.getTextField(body, ['beforeImage', 'before']);
      
    const afterImage = afterFile
      ? `/uploads/before-after/${afterFile.filename}`
      : this.getTextField(body, ['afterImage', 'after']);

    if (!beforeImage || !afterImage) {
      throw ApiError.badRequest('Before and after images are required', {
        receivedFields: Object.keys(body ?? {}),
        receivedFiles: Object.keys(files ?? {}),
        missing: {
          before: !beforeImage,
          after: !afterImage,
        },
      });
    }

    const record = await beforeAfterRepository.create({
      category,
      label,
      beforePath: beforeImage,
      afterPath: afterImage,
    });

    const total = (await beforeAfterRepository.findAll()).length;

    return {
      case: this.toResponseCase(record, baseUrl),
      total,
    };
  }
}

export const beforeAfterService = new BeforeAfterService();
