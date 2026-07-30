import {
  contactRepository,
  type ContactRecord,
  type ContactTiming,
  type CreateContactInput,
  type UpdateContactInput,
} from '../repositories/contact.repository';
import { ApiError } from '../utils/ApiError';

export interface ContactResponse extends ContactRecord {}

class ContactService {
  private normalizeTimings(value: unknown): ContactTiming[] {
    let source = value;

    if (typeof value === 'string') {
      try {
        source = JSON.parse(value);
      } catch {
        return [];
      }
    }

    if (!Array.isArray(source)) return [];

    return source
      .map((item) => ({
        label: String(item?.label ?? '').trim(),
        value: String(item?.value ?? '').trim(),
        isClosed: Boolean(item?.isClosed),
      }))
      .filter((item) => item.label && item.value);
  }

  private normalizeCreateInput(input: any): CreateContactInput {
    return {
      heading: String(input.heading ?? '').trim(),
      address: String(input.address ?? '').trim(),
      phone: String(input.phone ?? '').trim(),
      website: String(input.website ?? '').trim(),
      mapLink: String(input.mapLink ?? '').trim(),
      timings: this.normalizeTimings(input.timings),
    };
  }

  private normalizeUpdateInput(input: any): UpdateContactInput {
    const output: UpdateContactInput = {};
    ['heading', 'address', 'phone', 'website', 'mapLink'].forEach((key) => {
      if (input[key] !== undefined) {
        (output as Record<string, string>)[key] = String(input[key]).trim();
      }
    });

    if (input.timings !== undefined) output.timings = this.normalizeTimings(input.timings);
    return output;
  }

  private validateRequired(input: CreateContactInput) {
    if (!input.heading || !input.address || !input.phone) {
      throw ApiError.badRequest('Heading, address, and phone are required');
    }
  }

  async getAll(): Promise<ContactResponse[]> {
    return contactRepository.findAll();
  }

  async getById(id: string): Promise<ContactResponse> {
    const record = await contactRepository.findById(id);
    if (!record) throw ApiError.notFound('Contact section not found');
    return record;
  }

  async create(input: any): Promise<ContactResponse> {
    const normalized = this.normalizeCreateInput(input);
    this.validateRequired(normalized);
    return contactRepository.create(normalized);
  }

  async update(id: string, input: any): Promise<ContactResponse> {
    const record = await contactRepository.update(id, this.normalizeUpdateInput(input));
    if (!record) throw ApiError.notFound('Contact section not found');
    return record;
  }

  async delete(id: string): Promise<void> {
    const deleted = await contactRepository.delete(id);
    if (!deleted) throw ApiError.notFound('Contact section not found');
  }
}

export const contactService = new ContactService();
