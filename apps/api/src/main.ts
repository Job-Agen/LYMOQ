import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnv } from './config/env';

async function bootstrap(): Promise<void> {
  loadDotEnv();
  const env = loadEnv();
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });

  const origins = env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean);
  app.enableCors({ origin: origins.length > 0 ? origins : true });
  app.enableShutdownHooks();

  await app.listen(env.PORT, '0.0.0.0');
  const logger = new Logger('Bootstrap');
  logger.log(`PÔ API listening on http://localhost:${env.PORT}`);
  if (env.SANDBOX_MODE) logger.warn('SANDBOX_MODE is on — no real money, cards or KYC are involved.');
}

/** Loads apps/api/.env when present; real deployments inject env vars directly. */
function loadDotEnv(): void {
  try {
    process.loadEnvFile();
  } catch {
    // No .env file — rely on the process environment.
  }
}

void bootstrap();
