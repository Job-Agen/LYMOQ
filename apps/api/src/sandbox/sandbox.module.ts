import { Module } from '@nestjs/common';
import { FundingModule } from '../funding/funding.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { SandboxController } from './sandbox.controller';
import { SandboxModeGuard } from './sandbox-mode.guard';

@Module({
  imports: [FundingModule, TransactionsModule],
  controllers: [SandboxController],
  providers: [SandboxModeGuard],
})
export class SandboxModule {}
