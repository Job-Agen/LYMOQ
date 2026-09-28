import { Injectable, Logger } from '@nestjs/common';
import { randomInt, randomUUID } from 'node:crypto';
import type {
  CardIssuerProvider,
  CreateCardRequest,
  IssuedCard,
  IssuerCardStatus,
} from '../card-issuer-provider.interface';

/**
 * Fake virtual card issuer. It never generates or returns a PAN or CVV:
 * only a random provider id and a random last4 for the masked display.
 */
@Injectable()
export class SandboxCardIssuerProvider implements CardIssuerProvider {
  private readonly logger = new Logger(SandboxCardIssuerProvider.name);
  private readonly cards = new Map<string, IssuedCard>();

  async createCard(request: CreateCardRequest): Promise<IssuedCard> {
    const card: IssuedCard = {
      providerCardId: `sbx_card_${randomUUID()}`,
      last4: randomInt(0, 10_000).toString().padStart(4, '0'),
      status: 'ACTIVE',
    };
    this.cards.set(card.providerCardId, card);
    this.logger.log(`Sandbox card issued ${card.providerCardId} for card ${request.cardId}`);
    return { ...card };
  }

  async freezeCard(providerCardId: string): Promise<void> {
    this.setStatus(providerCardId, 'FROZEN');
  }

  async unfreezeCard(providerCardId: string): Promise<void> {
    this.setStatus(providerCardId, 'ACTIVE');
  }

  async terminateCard(providerCardId: string): Promise<void> {
    this.setStatus(providerCardId, 'TERMINATED');
  }

  async getCard(providerCardId: string): Promise<IssuedCard | null> {
    const card = this.cards.get(providerCardId);
    return card ? { ...card } : null;
  }

  private setStatus(providerCardId: string, status: IssuerCardStatus): void {
    const card = this.cards.get(providerCardId);
    // Cards issued before an API restart are unknown in memory; the DB stays authoritative.
    if (card) card.status = status;
  }
}
