import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { kycStartSchema, type KycProfileDto, type KycStartInput } from '@po/shared';
import { CurrentUserId } from '../common/auth-user';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kyc: KycService) {}

  @Get()
  get(@CurrentUserId() userId: string): Promise<KycProfileDto> {
    return this.kyc.get(userId);
  }

  @Post('start')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  start(
    @CurrentUserId() userId: string,
    @Body(new ZodValidationPipe(kycStartSchema)) body: KycStartInput,
  ): Promise<KycProfileDto> {
    return this.kyc.start(userId, body);
  }

  @Post('complete')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  complete(@CurrentUserId() userId: string): Promise<KycProfileDto> {
    return this.kyc.complete(userId);
  }
}
