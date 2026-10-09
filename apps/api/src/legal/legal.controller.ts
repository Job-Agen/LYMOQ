import { Controller, Get, Header, Inject } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../common/auth-user';
import { APP_ENV, type AppEnv } from '../config/env';
import { deleteAccountPage, privacyPolicyPage, type LegalContact } from './legal.pages';

/**
 * Public pages required by app stores: privacy policy and account deletion instructions.
 * Served by the API so they share its stable https URL.
 */
@Public()
@SkipThrottle()
@Controller('legal')
export class LegalController {
  constructor(@Inject(APP_ENV) private readonly env: AppEnv) {}

  private contact(): LegalContact {
    return { publisher: this.env.LEGAL_PUBLISHER, email: this.env.SUPPORT_EMAIL, sandbox: this.env.SANDBOX_MODE };
  }

  @Get('privacy')
  @Header('Content-Type', 'text/html; charset=utf-8')
  privacy(): string {
    return privacyPolicyPage(this.contact());
  }

  @Get('delete-account')
  @Header('Content-Type', 'text/html; charset=utf-8')
  deleteAccount(): string {
    return deleteAccountPage(this.contact());
  }
}
