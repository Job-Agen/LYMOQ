import { Module } from '@nestjs/common';
import { CardsModule } from '../cards/cards.module';
import { KycModule } from '../kyc/kyc.module';
import { FundingController } from './funding.controller';
import { FundingService } from './funding.service';

@Module({
  imports: [CardsModule, KycModule],
  controllers: [FundingController],
  providers: [FundingService],
  exports: [FundingService],
})
export class FundingModule {}
