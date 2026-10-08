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
      return "Cette carte n'est pas active. Elle est peut-être gelée ou clôturée.";
    case DeclineReason.CARD_EXPIRED:
      return 'Cette carte a expiré.';
    case DeclineReason.AMOUNT_LIMIT_EXCEEDED:
      return 'Ce paiement dépasse le montant que cette carte est autorisée à dépenser.';
    case DeclineReason.TRANSACTION_LIMIT_REACHED:
      return 'Cette carte a déjà été utilisée le nombre maximum de fois.';
    case DeclineReason.MERCHANT_NOT_ALLOWED:
      return context.merchantRestrictionName
        ? `Cette carte ne peut être utilisée que chez ${context.merchantRestrictionName}.`
        : 'Cette carte ne peut pas être utilisée chez ce marchand.';
  }
}
