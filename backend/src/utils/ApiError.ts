/**
 * Use this class to throw any "expected" error in controllers/services
 * (bad input, not found, unauthorized, etc). The global error handler
 * knows how to turn this into the uniform error response shape.
 *
 * Anything that is NOT an ApiError is treated as an unexpected bug and
 * gets logged with full detail + returns a generic 500 to the client.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', details?: unknown) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized', details?: unknown) {
    return new ApiError(401, message, details);
  }

  static forbidden(message = 'Forbidden', details?: unknown) {
    return new ApiError(403, message, details);
  }

  static notFound(message = 'Not Found', details?: unknown) {
    return new ApiError(404, message, details);
  }

  static conflict(message = 'Conflict', details?: unknown) {
    return new ApiError(409, message, details);
  }

  static tooManyRequests(message = 'Too Many Requests', details?: unknown) {
    return new ApiError(429, message, details);
  }

  static internal(message = 'Internal Server Error', details?: unknown) {
    return new ApiError(500, message, details, false);
  }
}
