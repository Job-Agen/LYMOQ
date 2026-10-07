/**
 * Domain enums shared by the API and the mobile app.
 * Values mirror the Prisma enums in apps/api/prisma/schema.prisma.
 */

export const CardStatus = {
  PENDING_FUNDING: 'PENDING_FUNDING',
  ACTIVE: 'ACTIVE',
  FROZEN: 'FROZEN',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED',
} as const;
export type CardStatus = (typeof CardStatus)[keyof typeof CardStatus];

/**
 * Why a card reached TERMINATED. A card whose usage rule is exhausted
 * (e.g. a one-payment card after its first approved payment) is TERMINATED
 * with USAGE_LIMIT_REACHED — there is no separate COMPLETED status.
 */
export const TerminationReason = {
  USER_REQUESTED: 'USER_REQUESTED',
  USAGE_LIMIT_REACHED: 'USAGE_LIMIT_REACHED',
} as const;
export type TerminationReason = (typeof TerminationReason)[keyof typeof TerminationReason];

export const FundingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
} as const;
export type FundingStatus = (typeof FundingStatus)[keyof typeof FundingStatus];

export const TransactionStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  BLOCKED: 'BLOCKED',
  FAILED: 'FAILED',
} as const;
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const KycStatus = {
  NOT_STARTED: 'NOT_STARTED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;
export type KycStatus = (typeof KycStatus)[keyof typeof KycStatus];

export const DeclineReason = {
  CARD_NOT_ACTIVE: 'CARD_NOT_ACTIVE',
  CARD_EXPIRED: 'CARD_EXPIRED',
  AMOUNT_LIMIT_EXCEEDED: 'AMOUNT_LIMIT_EXCEEDED',
  TRANSACTION_LIMIT_REACHED: 'TRANSACTION_LIMIT_REACHED',
  MERCHANT_NOT_ALLOWED: 'MERCHANT_NOT_ALLOWED',
} as const;
export type DeclineReason = (typeof DeclineReason)[keyof typeof DeclineReason];

export const MobileMoneyProvider = {
  TMONEY: 'TMONEY',
  FLOOZ: 'FLOOZ',
  MOOV_MONEY: 'MOOV_MONEY',
} as const;
export type MobileMoneyProvider = (typeof MobileMoneyProvider)[keyof typeof MobileMoneyProvider];

export const MOBILE_MONEY_PROVIDER_LABELS: Record<MobileMoneyProvider, string> = {
  TMONEY: 'TMoney',
  FLOOZ: 'Flooz',
  MOOV_MONEY: 'Moov Money',
};
