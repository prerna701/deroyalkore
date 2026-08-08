import {
  beforeAfterRepository,
  BeforeAfterCaseRecord,
} from '../repositories/beforeAfter.repository';
import { ApiError } from '../utils/ApiError';

export interface BeforeAfterCaseResponse {
  _id: string;
  label: string;
  before: string;
  after: string;
  treatmentIds: string[]; // New field
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
      label: record.label,
      before: this.toPublicUrl(record.beforePath, baseUrl),
      after: this.toPublicUrl(record.afterPath, baseUrl),
      treatmentIds: record.treatmentIds || [],
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

  async updateCase(id: string, body: Record<string, unknown>, files: { before?: Express.Multer.File[]; after?: Express.Multer.File[] } | undefined, baseUrl: string): Promise<BeforeAfterCaseResponse> {
    const label = this.getTextField(body, ['label', 'title', 'name']);
    const beforeImage = files?.before?.[0]
      ? `/uploads/before-after/${files.before[0].filename}`
      : this.getTextField(body, ['beforeImage', 'before']);
    const afterImage = files?.after?.[0]
      ? `/uploads/before-after/${files.after[0].filename}`
      : this.getTextField(body, ['afterImage', 'after']);
    const treatmentIds = Array.isArray(body.treatmentIds)
      ? body.treatmentIds.map((id: any) => String(id))
      : typeof body.treatmentIds === 'string'
      ? body.treatmentIds.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const updated = await beforeAfterRepository.update(id, { label, beforePath: beforeImage, afterPath: afterImage, treatmentIds });
    return this.toResponseCase(updated, baseUrl);
  }

  async deleteCase(id: string): Promise<void> {
    await beforeAfterRepository.delete(id);
  }

  async createCase(
    body: Record<string, unknown>,
    files: { before?: Express.Multer.File[]; after?: Express.Multer.File[] } | undefined,
    baseUrl: string
  ): Promise<{ case: BeforeAfterCaseResponse; total: number }> {
    const label = this.getTextField(body, ['label', 'title', 'name']);

    if (!label) {
      throw ApiError.badRequest('Label is required', {
        receivedFields: Object.keys(body ?? {}),
        missing: {
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

    const treatmentIds = Array.isArray(body.treatmentIds)
      ? body.treatmentIds.map((id: any) => String(id))
      : typeof body.treatmentIds === 'string'
      ? body.treatmentIds.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const record = await beforeAfterRepository.create({
      label,
      beforePath: beforeImage,
      afterPath: afterImage,
      treatmentIds,
    });

    const total = (await beforeAfterRepository.findAll()).length;

    return {
      case: this.toResponseCase(record, baseUrl),
      total,
    };
  }
}

export const beforeAfterService = new BeforeAfterService();
