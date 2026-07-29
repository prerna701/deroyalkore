import winston from 'winston';
import { env, isProd } from '../config/env';

/**
 * Central logger. Use this everywhere instead of console.log so that
 * logs are consistent, leveled, and easy to ship to a log service later.
 */
const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => {
    return `[${ts}] ${level}: ${stack || message}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: isProd ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
  exitOnError: false,
});

/** Stream adapter so morgan (HTTP request logging) can pipe into winston. */
export const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};
