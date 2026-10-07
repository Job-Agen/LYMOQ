import { Global, Module } from '@nestjs/common';
import { CardPolicyEngine } from './card-policy.engine';

@Global()
@Module({
  providers: [CardPolicyEngine],
  exports: [CardPolicyEngine],
})
export class CardPoliciesModule {}
