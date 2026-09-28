import type { Prisma } from '@prisma/client';
import { declineReasonMessage, type TransactionDto } from '@po/shared';
import { iso } from '../common/iso';

export const transactionInclude = {
  card: { select: { label: true, last4: true, policy: { select: { merchant: { select: { name: true } } } } } },
} satisfies Prisma.TransactionInclude;

export type TransactionWithCard = Prisma.TransactionGetPayload<{ include: typeof transactionInclude }>;

export function toTransactionDto(tx: TransactionWithCard): TransactionDto {
  return {
    id: tx.id,
    cardId: tx.cardId,
    cardLabel: tx.card.label,
    cardLast4: tx.card.last4,
    merchant: tx.merchant,
    merchantName: tx.merchantName,
    amount: tx.amount,
    currency: tx.currency,
    status: tx.status,
    declineReason: tx.declineReason,
    declineMessage: tx.declineReason
      ? declineReasonMessage(tx.declineReason, { merchantRestrictionName: tx.card.policy?.merchant?.name })
      : null,
    createdAt: iso(tx.createdAt),
  };
}
