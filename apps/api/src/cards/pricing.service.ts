import { Inject, Injectable } from '@nestjs/common';
import type { Currency, PricingDto } from '@mesura/shared';
import { APP_ENV, type AppEnv } from '../config/env';

/**
 * Illustrative pricing placeholder (default 5%: 15,000 FCFA → 750 FCFA).
 * Integer arithmetic only, rounded half-up to the nearest minor unit.
 */
@Injectable()
export class PricingService {
  constructor(@Inject(APP_ENV) private readonly env: AppEnv) {}

  quote(funding: number, currency: Currency): PricingDto {
    if (!Number.isInteger(funding) || funding <= 0) {
      throw new Error('Funding amount must be a positive integer');
    }
    const fee = Math.floor((funding * this.env.SERVICE_FEE_BPS + 5_000) / 10_000);
    return { funding, fee, total: funding + fee, currency, illustrative: true };
  }
}
