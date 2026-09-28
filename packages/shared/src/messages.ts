import { DeclineReason } from './enums';

/**
 * Plain-language copy for decline reasons. Backend decline codes are never
 * shown to users directly.
 */
export function declineReasonMessage(
  reason: DeclineReason,
  context: { merchantRestrictionName?: string | null } = {},
): string {
  switch (reason) {
    case DeclineReason.CARD_NOT_ACTIVE:
      return 'This card is not active. It may be frozen or closed.';
    case DeclineReason.CARD_EXPIRED:
      return 'This card has expired.';
    case DeclineReason.AMOUNT_LIMIT_EXCEEDED:
      return 'This payment is above the amount this card is allowed to spend.';
    case DeclineReason.TRANSACTION_LIMIT_REACHED:
      return 'This card has already been used the maximum number of times.';
    case DeclineReason.MERCHANT_NOT_ALLOWED:
      return context.merchantRestrictionName
        ? `This card can only be used with ${context.merchantRestrictionName}.`
        : 'This card cannot be used with this merchant.';
  }
}
