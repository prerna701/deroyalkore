import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Generic request validation middleware powered by Zod.
 *
 * Pass a schema shaped like:
 *   z.object({ body: z.object({...}), params: z.object({...}), query: z.object({...}) })
 *
 * Only include the keys (body/params/query) you actually want validated.
 * On success, req.body/params/query are REPLACED with the parsed
 * (and type-coerced/defaulted) values, so controllers get clean data.
 * On failure, it throws a 400 ApiError with field-level details.
 */
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      if (parsed.query) req.query = parsed.query as typeof req.query;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(ApiError.badRequest('Validation failed', details));
        return;
      }
      next(err);
    }
  };
