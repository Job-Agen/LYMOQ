import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { FundingStatus } from '@mesura/shared';
import { APP_ENV, type AppEnv } from '../../config/env';
import type {
  FundingStatusResult,
  InitiateFundingRequest,
  InitiateFundingResult,
  PaymentProvider,
} from '../payment-provider.interface';

interface SandboxPayment {
  status: FundingStatus;
  createdAt: number;
}

/**
 * Fake Mobile Money (TMoney / Flooz / Moov Money). No network call, no money.
 * A request is confirmed either manually (POST /sandbox/funding/:id/confirm)
 * or automatically after SANDBOX_FUNDING_AUTO_CONFIRM_SECONDS.
 *
 * The creation time is encoded in the reference (sbx_mm_<epoch ms>_<uuid>), so
 * auto-confirmation also works when requests land on different instances
 * (serverless) or after a restart. Manual confirmations are kept in memory and
 * applied within the same request that triggers them.
 */
@Injectable()
export class SandboxMobileMoneyProvider implements PaymentProvider {
  private readonly logger = new Logger(SandboxMobileMoneyProvider.name);
  private readonly payments = new Map<string, SandboxPayment>();

  constructor(@Inject(APP_ENV) private readonly env: AppEnv) {}

  async initiateFunding(request: InitiateFundingRequest): Promise<InitiateFundingResult> {
    const createdAt = Date.now();
    const providerReference = `sbx_mm_${createdAt}_${randomUUID()}`;
    this.payments.set(providerReference, { status: 'PENDING', createdAt });
    // Never log the phone number.
    this.logger.log(`Sandbox ${request.provider} request ${providerReference} for ${request.amount} ${request.currency}`);
    return { providerReference, status: 'PENDING' };
  }

  async getFundingStatus(providerReference: string): Promise<FundingStatusResult> {
    const payment = this.payments.get(providerReference) ?? restore(providerReference);
    if (!payment) return { status: 'PENDING' };
    this.payments.set(providerReference, payment);

    const autoConfirmMs = this.env.SANDBOX_FUNDING_AUTO_CONFIRM_SECONDS * 1000;
    if (payment.status === 'PENDING' && autoConfirmMs > 0 && Date.now() - payment.createdAt >= autoConfirmMs) {
      payment.status = 'CONFIRMED';
    }
    return { status: payment.status };
  }

  /** Sandbox-only: behaves as if the user approved the request on their phone. */
  simulateCustomerConfirmation(providerReference: string): void {
    const payment = this.payments.get(providerReference) ??
      restore(providerReference) ?? { status: 'PENDING', createdAt: Date.now() };
    if (payment.status === 'PENDING') payment.status = 'CONFIRMED';
    this.payments.set(providerReference, payment);
  }
}

/** Rebuilds a pending payment from a reference created by any instance. */
function restore(providerReference: string): SandboxPayment | null {
  const match = /^sbx_mm_(\d{13})_/.exec(providerReference);
  return match?.[1] ? { status: 'PENDING', createdAt: Number(match[1]) } : null;
}
