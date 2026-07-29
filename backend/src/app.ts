import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

import { env } from './config/env';
import { morganStream } from './utils/logger';
import { rateLimiter } from './middlewares/rateLimiter';
import { requestIdMiddleware } from './middlewares/requestId';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

/**
 * This file only wires up the Express app (middleware + routes).
 * It does NOT start listening on a port - see server.ts for that.
 * Keeping them separate makes the app importable/testable
 * (e.g. with supertest) without actually opening a network port.
 */
const app: Application = express();

// --- Security & core middleware ---
app.use(requestIdMiddleware);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(compression());
app.use(rateLimiter);

// --- Body parsing ---
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- Request logging ---
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined', { stream: morganStream }));

// --- Routes ---
const prefixes = Array.from(new Set([env.API_PREFIX, env.API_PREFIX === '/v1' ? '/api/v1' : '/v1', '/v1', '/api/v1']));
prefixes.forEach((prefix) => {
  app.use(prefix, routes);
});

// --- 404 + centralized error handling (must be LAST) ---
app.use(notFound);
app.use(errorHandler);

export default app;
