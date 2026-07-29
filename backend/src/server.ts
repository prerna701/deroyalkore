import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const server = http.createServer(app);

const startServer = (port: number) => {
  server.listen(port, () => {
    logger.info(` Server running in ${env.NODE_ENV} mode on port ${port}`);
    logger.info(`   API base URL: http://localhost:${port}${env.API_PREFIX}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${port} is already in use. Please stop the existing process or choose a different port.`);
      shutdown(1);
    } else {
      logger.error('Server startup failed', { error });
      shutdown(1);
    }
  });
};

startServer(env.PORT);
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', { reason });
  shutdown(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error });
  shutdown(1);
});

// Graceful shutdown on Ctrl+C / container stop signals.
process.on('SIGTERM', () => shutdown(0));
process.on('SIGINT', () => shutdown(0));

function shutdown(code: number) {
  logger.info('Shutting down gracefully...');
  server.close(() => {
    process.exit(code);
  });

  // Force-exit if something hangs and doesn't close in time.
  setTimeout(() => process.exit(code), 10_000).unref();
}
