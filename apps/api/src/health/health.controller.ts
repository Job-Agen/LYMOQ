import { Controller, Get, Inject } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../common/auth-user';
import { APP_ENV, type AppEnv } from '../config/env';

/** Unauthenticated liveness check for deployments and the app's server setting. */
@Public()
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(@Inject(APP_ENV) private readonly env: AppEnv) {}

  @Get()
  health(): { status: 'ok'; service: 'mesura-api'; sandbox: boolean } {
    return { status: 'ok', service: 'mesura-api', sandbox: this.env.SANDBOX_MODE };
  }
}
