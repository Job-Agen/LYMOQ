import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { fundCardSchema, type FundCardInput, type FundingDto } from '@mesura/shared';
import { CurrentUserId } from '../common/auth-user';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { FundingService } from './funding.service';

@Controller()
export class FundingController {
  constructor(private readonly funding: FundingService) {}

  @Post('cards/:id/fund')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  fund(
    @CurrentUserId() userId: string,
    @Param('id') cardId: string,
    @Body(new ZodValidationPipe(fundCardSchema)) body: FundCardInput,
  ): Promise<FundingDto> {
    return this.funding.initiate(userId, cardId, body);
  }

  /** Polled by the app while waiting for the Mobile Money confirmation. */
  @Get('funding/:id')
  get(@CurrentUserId() userId: string, @Param('id') id: string): Promise<FundingDto> {
    return this.funding.get(userId, id);
  }
}
