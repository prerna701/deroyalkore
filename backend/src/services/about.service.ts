import {
  aboutRepository,
  type AboutRecord,
  type CreateAboutInput,
  type UpdateAboutInput,
} from '../repositories/about.repository';
import { ApiError } from '../utils/ApiError';

export interface AboutResponse extends AboutRecord {}

class AboutService {
  private normalizeStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        return value
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return [];
  }

  private normalizeCreateInput(input: any): CreateAboutInput {
    return {
      badge: String(input.badge ?? '').trim(),
      badgeLabel: String(input.badgeLabel ?? '').trim(),
      tagline: String(input.tagline ?? '').trim(),
      titlePrefix: String(input.titlePrefix ?? '').trim(),
      titleSuffix: String(input.titleSuffix ?? '').trim(),
      paragraphs: this.normalizeStringArray(input.paragraphs),
      buttonText: String(input.buttonText ?? '').trim(),
      images: this.normalizeStringArray(input.images),
    };
  }

  private normalizeUpdateInput(input: any): UpdateAboutInput {
    const output: UpdateAboutInput = {};
    ['badge', 'badgeLabel', 'tagline', 'titlePrefix', 'titleSuffix', 'buttonText'].forEach((key) => {
      if (input[key] !== undefined) {
        (output as Record<string, string>)[key] = String(input[key]).trim();
      }
    });

    if (input.paragraphs !== undefined) output.paragraphs = this.normalizeStringArray(input.paragraphs);
    if (input.images !== undefined) output.images = this.normalizeStringArray(input.images);

    return output;
  }

  private validateRequired(input: CreateAboutInput) {
    if (!input.tagline || !input.titlePrefix || !input.titleSuffix) {
      throw ApiError.badRequest('Tagline, title prefix, and title suffix are required');
    }

    if (input.paragraphs.length === 0) {
      throw ApiError.badRequest('At least one about paragraph is required');
    }
  }

  async getAll(): Promise<AboutResponse[]> {
    return aboutRepository.findAll();
  }

  async getById(id: string): Promise<AboutResponse> {
    const record = await aboutRepository.findById(id);
    if (!record) throw ApiError.notFound('About section not found');
    return record;
  }

  async create(input: any): Promise<AboutResponse> {
    const normalized = this.normalizeCreateInput(input);
    this.validateRequired(normalized);
    return aboutRepository.create(normalized);
  }

  async update(id: string, input: any): Promise<AboutResponse> {
    const record = await aboutRepository.update(id, this.normalizeUpdateInput(input));
    if (!record) throw ApiError.notFound('About section not found');
    return record;
  }

  async delete(id: string): Promise<void> {
    const deleted = await aboutRepository.delete(id);
    if (!deleted) throw ApiError.notFound('About section not found');
  }
}

export const aboutService = new AboutService();
