import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import {
  createCardDraftSchema,
  updateCardRulesSchema,
  type CardDto,
  type CreateCardDraftInput,
  type UpdateCardRulesInput,
} from '@mesura/shared';
import { CurrentUserId } from '../common/auth-user';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cards: CardsService) {}

  @Get()
  list(@CurrentUserId() userId: string): Promise<CardDto[]> {
    return this.cards.list(userId);
  }

  @Post('draft')
  createDraft(
    @CurrentUserId() userId: string,
    @Body(new ZodValidationPipe(createCardDraftSchema)) body: CreateCardDraftInput,
  ): Promise<CardDto> {
    return this.cards.createDraft(userId, body);
  }

  @Get(':id')
  get(@CurrentUserId() userId: string, @Param('id') id: string): Promise<CardDto> {
    return this.cards.get(userId, id);
  }

  @Post(':id/freeze')
  @HttpCode(200)
  freeze(@CurrentUserId() userId: string, @Param('id') id: string): Promise<CardDto> {
    return this.cards.freeze(userId, id);
  }

  @Post(':id/unfreeze')
  @HttpCode(200)
  unfreeze(@CurrentUserId() userId: string, @Param('id') id: string): Promise<CardDto> {
    return this.cards.unfreeze(userId, id);
  }

  @Patch(':id/rules')
  updateRules(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCardRulesSchema)) body: UpdateCardRulesInput,
  ): Promise<CardDto> {
    return this.cards.updateRules(userId, id, body);
  }

  /** Terminates the card. The record is kept for the activity history. */
  @Delete(':id')
  terminate(@CurrentUserId() userId: string, @Param('id') id: string): Promise<CardDto> {
    return this.cards.terminate(userId, id);
  }
}
