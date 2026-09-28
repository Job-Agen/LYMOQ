export interface KycSubmission {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  country: string;
}

export interface KycVerificationResult {
  providerReference: string;
  decision: 'VERIFIED' | 'REJECTED';
}

/**
 * Identity verification. Sandbox: SandboxKycProvider (no document is uploaded
 * or stored). Future: a regulated KYC vendor.
 */
export interface KycProvider {
  verify(submission: KycSubmission): Promise<KycVerificationResult>;
}

export const KYC_PROVIDER = Symbol('KYC_PROVIDER');
