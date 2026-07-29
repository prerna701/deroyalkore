import { Response } from 'express';
import type { PaginationMeta } from '../types/common.types';

/**
 * Every successful API response follows this exact shape:
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "Users fetched successfully",
 *   "data": [...],
 *   "meta": {
 *     "timestamp": "2026-07-27T08:25:31.102Z",
 *     "requestId": "0b1dc6d3-cb6e-4a77-a18b-a7249d9a8455",
 *     "pagination": {
 *       "page": 1,
 *       "limit": 10,
 *       "total": 42,
 *       "totalPages": 5,
 *       "hasNextPage": true,
 *       "hasPreviousPage": false
 *     }
 *   }
 * }
 *
 * Controllers should NEVER call res.json(...) directly.
 * Always use ApiResponse.send(res, ...) so every endpoint in the app
 * looks and behaves the same way from the client's point of view.
 */
export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
  pagination?: PaginationMeta;
  [key: string]: unknown;
}

export interface ApiResponseBody<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta: ResponseMeta;
}

export class ApiResponse<T = unknown> {
  public readonly success = true;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T;
  public readonly meta: Partial<ResponseMeta>;

  constructor(statusCode: number, data: T, message = 'Success', meta: Partial<ResponseMeta> = {}) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  /** Send this response straight to the client. */
  send(res: Response): Response {
    const body: ApiResponseBody<T> = {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId,
        ...this.meta,
      },
    };

    return res.status(this.statusCode).json(body);
  }

  /** Shortcut so controllers can do: return ApiResponse.ok(res, data) */
  static ok<T>(res: Response, data: T, message = 'Success', meta?: Partial<ResponseMeta>): Response {
    return new ApiResponse(200, data, message, meta).send(res);
  }

  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return new ApiResponse(201, data, message).send(res);
  }

  static updated<T>(res: Response, data: T, message = 'Updated successfully'): Response {
    return new ApiResponse(200, data, message).send(res);
  }

  static deleted(res: Response, message = 'Deleted successfully'): Response {
    return new ApiResponse(200, null, message).send(res);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message = 'Fetched successfully',
  ): Response {
    return new ApiResponse(200, data, message, { pagination }).send(res);
  }

  static accepted<T>(res: Response, data: T, message = 'Accepted'): Response {
    return new ApiResponse(202, data, message).send(res);
  }

  static custom<T>(
    res: Response,
    statusCode: number,
    data: T,
    message: string,
    meta?: Partial<ResponseMeta>,
  ): Response {
    return new ApiResponse(statusCode, data, message, meta).send(res);
  }

  /**
   * For deletes / actions with nothing meaningful to return.
   * NOTE: uses 200 (not 204) on purpose - a real 204 response must have
   * no body, which would break the uniform JSON shape every other endpoint uses.
   */
  static noContent(res: Response, message = 'Deleted successfully'): Response {
    return ApiResponse.deleted(res, message);
  }
}
