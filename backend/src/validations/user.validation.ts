import { z } from 'zod';

/**
 * VALIDATION LAYER
 * ----------------
 * One Zod schema per route/action. These are consumed by the `validate`
 * middleware (see src/middlewares/validate.ts) and plugged directly
 * into the route definitions - e.g:
 *
 *   router.post('/', validate(createUserSchema), userController.createUser);
 *
 * Keep validation rules here, NOT in the controller. That way the same
 * rules can be reused, unit tested, or introspected on their own.
 */

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().trim().toLowerCase().email('Must be a valid email address'),
    age: z.coerce.number().int().min(0).max(150).optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user id'),
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      email: z.string().trim().toLowerCase().email('Must be a valid email address').optional(),
      age: z.coerce.number().int().min(0).max(150).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user id'),
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});
