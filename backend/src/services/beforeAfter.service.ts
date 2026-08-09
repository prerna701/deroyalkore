import fs from 'fs';
import path from 'path';
import {
  beforeAfterRepository,
  BeforeAfterCaseRecord,
} from '../repositories/beforeAfter.repository';
import { ApiError } from '../utils/ApiError';
import { treatmentRepository } from '../repositories/treatment.repository';

const deleteFileSafe = async (urlPath: string) => {
  if (!urlPath) return;
  let relativePath = urlPath;
  if (urlPath.startsWith('http')) {
    try {
      const url = new URL(urlPath);
      relativePath = url.pathname;
    } catch (e) {
      // Ignore
    }
  }
  if (relativePath.startsWith('/uploads/before-after/')) {
    const fullPath = path.join(process.cwd(), relativePath);
    try {
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    } catch (err) {
      console.error(`Failed to delete file: ${fullPath}`, err);
    }
  }
};

export interface BeforeAfterCaseResponse {
  _id: string;
  label: string;
  before: string;
  after: string;
  treatmentIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface ParsedCaseInput {
  label: string;
  beforeFile?: Express.Multer.File;
  afterFile?: Express.Multer.File;
  treatmentIds: string[];
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

  private async validateTreatmentIds(treatmentIds: string[]): Promise<void> {
    for (const tid of treatmentIds) {
      if (!tid) continue;
      const exists = await treatmentRepository.findById(tid);
      if (!exists) {
        throw ApiError.badRequest(`Treatment with ID "${tid}" does not exist`);
      }
    }
  }

  private parseMultipartCases(
    body: Record<string, any>,
    files: Express.Multer.File[] | undefined
  ): ParsedCaseInput[] {
    if (!body || !Array.isArray(body.cases)) {
      console.warn("parseMultipartCases: body.cases is missing or not an array");
    }

    const casesMap = new Map<number, Partial<ParsedCaseInput>>();

    if (body && Array.isArray(body.cases)) {
      body.cases.forEach((raw: any, idx: number) => {
        if (!raw) return;
        const treatmentIds = Array.isArray(raw.treatmentIds)
          ? raw.treatmentIds.map((id: any) => String(id))
          : typeof raw.treatmentIds === 'string'
            ? raw.treatmentIds.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [];

        casesMap.set(idx, {
          label: typeof raw.label === 'string' ? raw.label.trim() : '',
          treatmentIds,
        });
      });
    }

    if (files && Array.isArray(files)) {
      for (const file of files) {
        const match = file.fieldname.match(/^cases\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const idx = parseInt(match[1], 10);
          const field = match[2];
          if (!casesMap.has(idx)) {
            casesMap.set(idx, { treatmentIds: [] });
          }
          const caseData = casesMap.get(idx)!;
          if (field === 'before') {
            caseData.beforeFile = file;
          } else if (field === 'after') {
            caseData.afterFile = file;
          }
        }
      }
    }

    const result: ParsedCaseInput[] = [];
    const sortedIndices = Array.from(casesMap.keys()).sort((a, b) => a - b);
    for (const idx of sortedIndices) {
      const caseData = casesMap.get(idx)!;
      result.push({
        label: caseData.label || '',
        beforeFile: caseData.beforeFile,
        afterFile: caseData.afterFile,
        treatmentIds: caseData.treatmentIds || [],
      });
    }

    return result;
  }

  async getAllCases(baseUrl: string): Promise<BeforeAfterCaseResponse[]> {
    const records = await beforeAfterRepository.findAll();
    return records.map(record => this.toResponseCase(record, baseUrl));
  }

  async updateCase(
    id: string,
    body: Record<string, any>,
    files: Express.Multer.File[] | undefined,
    baseUrl: string
  ): Promise<BeforeAfterCaseResponse> {
    const existing = await beforeAfterRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Before/After case not found');
    }

    const parsedCases = this.parseMultipartCases(body, files);
    const parsed = parsedCases[0]; 

    const label = parsed?.label || existing.label;
    const treatmentIds = parsed?.treatmentIds || existing.treatmentIds || [];

    const beforeImage = parsed?.beforeFile
      ? `/uploads/before-after/${parsed.beforeFile.filename}`
      : existing.beforePath;

    const afterImage = parsed?.afterFile
      ? `/uploads/before-after/${parsed.afterFile.filename}`
      : existing.afterPath;

    if (parsed?.treatmentIds && parsed.treatmentIds.length > 0) {
      await this.validateTreatmentIds(parsed.treatmentIds);
    }

    try {
      const updated = await beforeAfterRepository.update(id, {
        label,
        beforePath: beforeImage,
        afterPath: afterImage,
        treatmentIds,
      });

      if (parsed?.beforeFile && existing.beforePath !== beforeImage) {
        await deleteFileSafe(existing.beforePath);
      }
      if (parsed?.afterFile && existing.afterPath !== afterImage) {
        await deleteFileSafe(existing.afterPath);
      }

      return this.toResponseCase(updated, baseUrl);
    } catch (err) {
      if (files && Array.isArray(files)) {
        for (const file of files) {
          const filePath = `/uploads/before-after/${file.filename}`;
          await deleteFileSafe(filePath);
        }
      }
      throw err;
    }
  }

  async deleteCase(id: string): Promise<void> {
    const existing = await beforeAfterRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Before/After case not found');
    }

    await deleteFileSafe(existing.beforePath);
    await deleteFileSafe(existing.afterPath);
    await beforeAfterRepository.delete(id);
  }

  async createCases(
    body: Record<string, any>,
    files: Express.Multer.File[] | undefined,
    baseUrl: string
  ): Promise<{ cases: BeforeAfterCaseResponse[]; total: number }> {
    const parsedCases = this.parseMultipartCases(body, files);

    if (parsedCases.length === 0) {
      throw ApiError.badRequest('No before/after cases were provided in the request');
    }

    const createdRecords: BeforeAfterCaseRecord[] = [];

    try {
      for (const item of parsedCases) {
        if (!item.label) {
          throw ApiError.badRequest('Label is required for all cases');
        }
        if (!item.beforeFile || !item.afterFile) {
          throw ApiError.badRequest('Both before and after images are required to create a case');
        }

        if (item.treatmentIds && item.treatmentIds.length > 0) {
          await this.validateTreatmentIds(item.treatmentIds);
        }

        const beforePath = `/uploads/before-after/${item.beforeFile.filename}`;
        const afterPath = `/uploads/before-after/${item.afterFile.filename}`;

        const record = await beforeAfterRepository.create({
          label: item.label,
          beforePath,
          afterPath,
          treatmentIds: item.treatmentIds,
        });

        createdRecords.push(record);
      }

      const total = (await beforeAfterRepository.findAll()).length;

      return {
        cases: createdRecords.map(r => this.toResponseCase(r, baseUrl)),
        total,
      };
    } catch (err) {
      if (files && Array.isArray(files)) {
        for (const file of files) {
          const filePath = `/uploads/before-after/${file.filename}`;
          await deleteFileSafe(filePath);
        }
      }
      for (const record of createdRecords) {
        try {
          await beforeAfterRepository.delete(record.id);
        } catch (dbErr) {
          console.error(`Failed to delete record ${record.id} on rollback`, dbErr);
        }
      }
      throw err;
    }
  }
}

export const beforeAfterService = new BeforeAfterService();
