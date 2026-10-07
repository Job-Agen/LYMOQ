import { Global, Module } from '@nestjs/common';
import { CARD_ISSUER_PROVIDER } from './card-issuer-provider.interface';
import { KYC_PROVIDER } from './kyc-provider.interface';
import { PAYMENT_PROVIDER } from './payment-provider.interface';
import { SandboxCardIssuerProvider } from './sandbox/sandbox-card-issuer.provider';
import { SandboxKycProvider } from './sandbox/sandbox-kyc.provider';
import { SandboxMobileMoneyProvider } from './sandbox/sandbox-mobile-money.provider';

/**
 * Binds provider interfaces to implementations. Swapping to a real partner
 * (issuer, Mobile Money aggregator, KYC vendor) happens here only — business
 * services depend on the injection tokens, never on the sandbox classes.
 */
@Global()
@Module({
  providers: [
    SandboxMobileMoneyProvider,
    SandboxCardIssuerProvider,
    SandboxKycProvider,
    { provide: PAYMENT_PROVIDER, useExisting: SandboxMobileMoneyProvider },
    { provide: CARD_ISSUER_PROVIDER, useExisting: SandboxCardIssuerProvider },
    { provide: KYC_PROVIDER, useExisting: SandboxKycProvider },
  ],
  exports: [PAYMENT_PROVIDER, CARD_ISSUER_PROVIDER, KYC_PROVIDER, SandboxMobileMoneyProvider],
})
export class ProvidersModule {}
