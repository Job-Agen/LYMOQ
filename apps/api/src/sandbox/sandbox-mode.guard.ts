import { CanActivate, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { APP_ENV, type AppEnv } from '../config/env';

/** Sandbox endpoints do not exist unless SANDBOX_MODE=true. */
@Injectable()
export class SandboxModeGuard implements CanActivate {
  constructor(@Inject(APP_ENV) private readonly env: AppEnv) {}

  canActivate(): boolean {
    if (!this.env.SANDBOX_MODE) throw new NotFoundException();
    return true;
  }
}
