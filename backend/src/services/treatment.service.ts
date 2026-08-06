import {
  treatmentRepository,
  TreatmentRecord,
} from '../repositories/treatment.repository';
import { ApiError } from '../utils/ApiError';

export interface TreatmentResponse {
  _id: string;
  slug: string;
  title: string;
  about: string;
  sessions: string;
  price: string;
  duration: string;
  protocol: string;
  bestFor: string[];
  benefits: string[];
  image: string;
  discountPrice?: string;
  createdAt: string;
  updatedAt: string;
}

class TreatmentService {
  private toPublicUrl(value: string, baseUrl: string): string {
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    return `${baseUrl}${value}`;
  }

  private toResponseTreatment(record: TreatmentRecord, baseUrl: string): TreatmentResponse {
    return {
      _id: record.id,
      slug: record.slug,
      title: record.title,
      about: record.about,
      sessions: record.sessions,
      price: record.price,
      duration: record.duration,
      protocol: record.protocol,
      bestFor: record.bestFor,
      benefits: record.benefits,
      image: this.toPublicUrl(record.image, baseUrl),
      discountPrice: record.discountPrice,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private parseArrayField(value: any): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return value.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  }

  async getAllTreatments(baseUrl: string): Promise<TreatmentResponse[]> {
    const records = await treatmentRepository.findAll();
    return records.map(record => this.toResponseTreatment(record, baseUrl));
  }

  async getTreatmentByIdOrSlug(idOrSlug: string, baseUrl: string): Promise<TreatmentResponse> {
    let record = await treatmentRepository.findById(idOrSlug);
    if (!record) {
      record = await treatmentRepository.findBySlug(idOrSlug);
    }

    if (!record) {
      throw ApiError.notFound('Treatment not found');
    }

    return this.toResponseTreatment(record, baseUrl);
  }

  async createTreatment(data: any, file: Express.Multer.File | undefined, baseUrl: string): Promise<TreatmentResponse> {
    const { title, about, sessions, price, discountPrice, duration, protocol } = data;

    if (!title || !about) {
      throw ApiError.badRequest('Title and about fields are required');
    }

    const bestFor = this.parseArrayField(data.bestFor);
    const benefits = this.parseArrayField(data.benefits);

    const image = file
      ? `/uploads/treatments/${file.filename}`
      : data.image;

    if (!image) {
      throw ApiError.badRequest('Image is required');
    }

    if (discountPrice && price) {
      const p = parseFloat(price);
      const dp = parseFloat(discountPrice);
      if (!isNaN(p) && !isNaN(dp) && dp >= p) {
        throw ApiError.badRequest('Discount price must be strictly less than the regular price');
      }
    }

    const record = await treatmentRepository.create({
      title,
      about,
      sessions: sessions || '1 Session',
      price: price || 'Contact for pricing',
      duration: duration || '60 mins',
      protocol: protocol || '',
      bestFor,
      benefits,
      image,
      discountPrice,
    });

    return this.toResponseTreatment(record, baseUrl);
  }

  async updateTreatment(id: string, data: any, file: Express.Multer.File | undefined, baseUrl: string): Promise<TreatmentResponse> {
    const existing = await treatmentRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Treatment not found');
    }

    const { title, about, sessions, price, discountPrice, duration, protocol } = data;
    const bestFor = data.bestFor ? this.parseArrayField(data.bestFor) : undefined;
    const benefits = data.benefits ? this.parseArrayField(data.benefits) : undefined;

    const image = file
      ? `/uploads/treatments/${file.filename}`
      : data.image;

    if (discountPrice && (price || existing.price)) {
      const p = parseFloat(price || existing.price);
      const dp = parseFloat(discountPrice);
      if (!isNaN(p) && !isNaN(dp) && dp >= p) {
        throw ApiError.badRequest('Discount price must be strictly less than the regular price');
      }
    }

    const updatedRecord = await treatmentRepository.update(id, {
      title,
      about,
      sessions,
      price,
      duration,
      protocol,
      bestFor,
      benefits,
      image,
      discountPrice: discountPrice === '' ? null : discountPrice,
    });

    return this.toResponseTreatment(updatedRecord!, baseUrl);
  }

  async deleteTreatment(id: string): Promise<void> {
    const success = await treatmentRepository.delete(id);
    if (!success) {
      throw ApiError.notFound('Treatment not found');
    }
  }
}

export const treatmentService = new TreatmentService();
