import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { KycProvider, KycSubmission, KycVerificationResult } from '../kyc-provider.interface';

const MIN_AGE_YEARS = 18;

/** Fake identity check: approves any adult. No document is collected. */
@Injectable()
export class SandboxKycProvider implements KycProvider {
  async verify(submission: KycSubmission): Promise<KycVerificationResult> {
    const adultCutoff = new Date();
    adultCutoff.setFullYear(adultCutoff.getFullYear() - MIN_AGE_YEARS);
    return {
      providerReference: `sbx_kyc_${randomUUID()}`,
      decision: submission.dateOfBirth <= adultCutoff ? 'VERIFIED' : 'REJECTED',
    };
  }
}
