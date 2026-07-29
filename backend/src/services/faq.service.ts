import {
  faqRepository,
  type CreateFaqInput,
  type FaqRecord,
  type UpdateFaqInput,
} from '../repositories/faq.repository';
import type { PaginationMeta } from '../types/common.types';
import { ApiError } from '../utils/ApiError';

export interface FaqResponse {
  id: string;
  question: string;
  answer: string;
}

export interface FaqPaginationMeta extends PaginationMeta {}

export interface FaqListResult {
  items: FaqResponse[];
  meta: FaqPaginationMeta;
}

class FaqService {
  private toResponse(record: FaqRecord): FaqResponse {
    return {
      id: record.id,
      question: record.question,
      answer: record.answer,
    };
  }

  private normalizeInput(input: CreateFaqInput | UpdateFaqInput): CreateFaqInput | UpdateFaqInput {
    return {
      ...(input as CreateFaqInput),
      question: input.question?.trim(),
      answer: input.answer?.trim(),
    };
  }

  async getFaqs(page: number, limit: number): Promise<FaqListResult> {
    const result = await faqRepository.findAllWithPagination(page, limit);

    return {
      items: result.items.map((record) => this.toResponse(record)),
      meta: result.meta,
    };
  }

  async createFaq(input: CreateFaqInput): Promise<FaqResponse> {
    const normalizedInput = this.normalizeInput(input) as CreateFaqInput;

    if (!normalizedInput.question || !normalizedInput.answer) {
      throw ApiError.badRequest('Question and answer are required');
    }

    const record = await faqRepository.create(normalizedInput);
    return this.toResponse(record);
  }

  async updateFaq(id: string, input: UpdateFaqInput): Promise<FaqResponse> {
    const normalizedInput = this.normalizeInput(input) as UpdateFaqInput;
    const record = await faqRepository.update(id, normalizedInput);

    if (!record) {
      throw ApiError.notFound('FAQ not found');
    }

    return this.toResponse(record);
  }

  async deleteFaq(id: string): Promise<void> {
    const deleted = await faqRepository.delete(id);
    if (!deleted) {
      throw ApiError.notFound('FAQ not found');
    }
  }
}

export const faqService = new FaqService();
