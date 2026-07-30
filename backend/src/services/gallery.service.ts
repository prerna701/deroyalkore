import {
  galleryRepository,
  type CreateGalleryInput,
  type GalleryImage,
  type GalleryRecord,
  type UpdateGalleryInput,
} from '../repositories/gallery.repository';
import { ApiError } from '../utils/ApiError';

export interface GalleryResponse extends GalleryRecord {}

class GalleryService {
  private normalizeImages(value: unknown): GalleryImage[] {
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
      .map((item, index) => ({
        id: String(item?.id || `gallery-image-${Date.now()}-${index}`),
        url: String(item?.url ?? '').trim(),
        title: String(item?.title ?? '').trim(),
        sortOrder: Number.isFinite(Number(item?.sortOrder)) ? Number(item.sortOrder) : index + 1,
      }))
      .filter((item) => item.url && item.title)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  private normalizeCreateInput(input: any): CreateGalleryInput {
    return {
      title: String(input.title ?? '').trim(),
      titleSuffix: String(input.titleSuffix ?? '').trim(),
      subtitle: String(input.subtitle ?? '').trim(),
      note: String(input.note ?? '').trim(),
      images: this.normalizeImages(input.images),
    };
  }

  private normalizeUpdateInput(input: any): UpdateGalleryInput {
    const output: UpdateGalleryInput = {};
    ['title', 'titleSuffix', 'subtitle', 'note'].forEach((key) => {
      if (input[key] !== undefined) {
        (output as Record<string, string>)[key] = String(input[key]).trim();
      }
    });

    if (input.images !== undefined) output.images = this.normalizeImages(input.images);
    return output;
  }

  private validateRequired(input: CreateGalleryInput) {
    if (!input.title || !input.titleSuffix || !input.subtitle) {
      throw ApiError.badRequest('Title, title suffix, and subtitle are required');
    }

    if (input.images.length === 0) {
      throw ApiError.badRequest('At least one gallery image is required');
    }
  }

  async getAll(): Promise<GalleryResponse[]> {
    return galleryRepository.findAll();
  }

  async getById(id: string): Promise<GalleryResponse> {
    const record = await galleryRepository.findById(id);
    if (!record) throw ApiError.notFound('Gallery section not found');
    return record;
  }

  async create(input: any): Promise<GalleryResponse> {
    const normalized = this.normalizeCreateInput(input);
    this.validateRequired(normalized);
    return galleryRepository.create(normalized);
  }

  async update(id: string, input: any): Promise<GalleryResponse> {
    const record = await galleryRepository.update(id, this.normalizeUpdateInput(input));
    if (!record) throw ApiError.notFound('Gallery section not found');
    return record;
  }

  async delete(id: string): Promise<void> {
    const deleted = await galleryRepository.delete(id);
    if (!deleted) throw ApiError.notFound('Gallery section not found');
  }
}

export const galleryService = new GalleryService();
