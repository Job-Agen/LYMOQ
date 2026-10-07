import { Body, Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  simulateTransactionSchema,
  type FundingDto,
  type SimulateTransactionInput,
  type SimulateTransactionResponseDto,
} from '@mesura/shared';
import { CurrentUserId } from '../common/auth-user';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { FundingService } from '../funding/funding.service';
import { SandboxMobileMoneyProvider } from '../providers/sandbox/sandbox-mobile-money.provider';
import { TransactionsService } from '../transactions/transactions.service';
import { SandboxModeGuard } from './sandbox-mode.guard';

/**
 * Developer tools that stand in for the outside world: the user approving a
 * Mobile Money request on their phone, and a merchant charging the card.
 */
@UseGuards(SandboxModeGuard)
@Controller('sandbox')
export class SandboxController {
  constructor(
    private readonly funding: FundingService,
    private readonly mobileMoney: SandboxMobileMoneyProvider,
    private readonly transactions: TransactionsService,
  ) {}

  @Post('funding/:id/confirm')
  @HttpCode(200)
  async confirmFunding(@CurrentUserId() userId: string, @Param('id') id: string): Promise<FundingDto> {
    const funding = await this.funding.findOwned(userId, id);
    this.mobileMoney.simulateCustomerConfirmation(funding.providerReference);
    return this.funding.get(userId, id);
  }

  @Post('transactions')
  @HttpCode(200)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  simulateTransaction(
    @CurrentUserId() userId: string,
    @Body(new ZodValidationPipe(simulateTransactionSchema)) body: SimulateTransactionInput,
  ): Promise<SimulateTransactionResponseDto> {
    return this.transactions.authorize(userId, body);
  }
}
