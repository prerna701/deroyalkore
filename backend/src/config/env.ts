import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * All environment variables the app needs, validated once at boot.
 * If something required is missing/wrong, the app fails fast with a clear error
 * instead of crashing later somewhere deep in the code.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(7000),
  API_PREFIX: z.string().default('/v1'),
  CORS_ORIGIN: z.string().default('*'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  MONGO_URI: z.string().default('mongodb://admin:admin123@mongodb:27017'),
  MONGO_DB_NAME: z.string().default('krish_site'),
  MONGO_CONNECT_TIMEOUT_MS: z.coerce.number().default(5000),
  MONGO_SERVER_SELECTION_TIMEOUT_MS: z.coerce.number().default(5000),
  MONGO_MAX_POOL_SIZE: z.coerce.number().default(10),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SMTP_SECURE: z.string().optional().transform(val => val === 'true').default('false'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
export const isDev = env.NODE_ENV === 'development';
