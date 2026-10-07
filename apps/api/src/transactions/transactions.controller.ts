import { Controller, Get, Param, Query } from '@nestjs/common';
import { transactionFilterSchema, type TransactionDto, type TransactionFilterInput } from '@mesura/shared';
import { CurrentUserId } from '../common/auth-user';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactions: TransactionsService) {}

  @Get()
  list(
    @CurrentUserId() userId: string,
    @Query(new ZodValidationPipe(transactionFilterSchema)) filter: TransactionFilterInput,
  ): Promise<TransactionDto[]> {
    return this.transactions.list(userId, filter);
  }

  @Get(':id')
  get(@CurrentUserId() userId: string, @Param('id') id: string): Promise<TransactionDto> {
    return this.transactions.get(userId, id);
  }
}
