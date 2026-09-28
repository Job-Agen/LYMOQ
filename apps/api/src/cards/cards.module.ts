import { Module } from '@nestjs/common';
import { KycModule } from '../kyc/kyc.module';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { PricingService } from './pricing.service';

@Module({
  imports: [KycModule],
  controllers: [CardsController],
  providers: [CardsService, PricingService],
  exports: [CardsService, PricingService],
})
export class CardsModule {}
