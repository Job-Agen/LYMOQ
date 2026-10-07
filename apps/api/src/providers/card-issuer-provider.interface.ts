export type IssuerCardStatus = 'ACTIVE' | 'FROZEN' | 'TERMINATED';

export interface CreateCardRequest {
  /** Our internal card id, used as the issuer-side external reference. */
  cardId: string;
  userId: string;
  label: string;
  expiresAt: Date;
}

/** Only non-sensitive card data ever crosses this boundary. */
export interface IssuedCard {
  providerCardId: string;
  last4: string;
  status: IssuerCardStatus;
}

/**
 * Issues and controls virtual cards.
 * Sandbox: SandboxCardIssuerProvider. Future: a licensed issuer/processor.
 */
export interface CardIssuerProvider {
  createCard(request: CreateCardRequest): Promise<IssuedCard>;
  freezeCard(providerCardId: string): Promise<void>;
  unfreezeCard(providerCardId: string): Promise<void>;
  terminateCard(providerCardId: string): Promise<void>;
  getCard(providerCardId: string): Promise<IssuedCard | null>;
}

export const CARD_ISSUER_PROVIDER = Symbol('CARD_ISSUER_PROVIDER');
