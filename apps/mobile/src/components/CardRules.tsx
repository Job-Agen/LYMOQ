import { formatDuration, formatMoney, type CardDto } from '@mesura/shared';
import { formatDate, formatTimeLeft, merchantLabel, paymentsLabel, paymentsUsage } from '@/lib/format';
import { Divider, RuleRow } from './RuleRow';

/** "before" = the rules as chosen (review); "live" = usage of an issued card (details). */
export function CardRules({ card, mode }: { card: CardDto; mode: 'before' | 'live' }) {
  const p = card.policy;
  if (mode === 'before') {
    return (
      <>
        <RuleRow icon="wallet-outline" label="Plafond" value={formatMoney(p.maxAmount, p.currency)} />
        <RuleRow icon="storefront-outline" label="Marchand" value={p.merchantRestriction?.name ?? 'Partout'} />
        <RuleRow icon="repeat-outline" label="Paiements" value={paymentsLabel(p.maxTransactionCount)} />
        <RuleRow icon="time-outline" label="Durée" value={formatDuration(p.durationMinutes)} />
      </>
    );
  }
  const live = card.status === 'ACTIVE' || card.status === 'FROZEN';
  return (
    <>
      <RuleRow icon="wallet-outline" label="Plafond" value={formatMoney(p.maxAmount, p.currency)} />
      <RuleRow icon="trending-down-outline" label="Dépensé" value={formatMoney(p.spentAmount, p.currency)} />
      <RuleRow icon="shield-checkmark-outline" label="Plafond restant" value={formatMoney(p.remainingLimit, p.currency)} emphasis />
      <Divider />
      <RuleRow icon="storefront-outline" label="Marchand" value={merchantLabel(card)} />
      <RuleRow icon="repeat-outline" label="Paiements" value={paymentsUsage(card)} />
      <RuleRow
        icon="time-outline"
        label="Expiration"
        value={live ? formatTimeLeft(card.expiresAt).replace('Expire dans ', 'dans ') : formatDate(card.expiresAt, true)}
      />
    </>
  );
}
