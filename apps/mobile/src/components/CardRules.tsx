import { formatDuration, formatMoney, type CardDto } from '@mesura/shared';
import { formatTimeLeft, merchantLabel, paymentsLabel, paymentsUsage } from '@/lib/format';
import { Divider, RuleRow } from './RuleRow';

/** "before" = the rules as chosen (review); "live" = usage of an issued card (details). */
export function CardRules({ card, mode }: { card: CardDto; mode: 'before' | 'live' }) {
  const p = card.policy;
  if (mode === 'before') {
    return (
      <>
        <RuleRow icon="wallet-outline" label="Maximum" value={formatMoney(p.maxAmount, p.currency)} />
        <RuleRow icon="storefront-outline" label="Merchant" value={p.merchantRestriction?.name ?? 'Anywhere'} />
        <RuleRow icon="repeat-outline" label="Payments" value={paymentsLabel(p.maxTransactionCount)} />
        <RuleRow icon="time-outline" label="Duration" value={formatDuration(p.durationMinutes)} />
      </>
    );
  }
  const live = card.status === 'ACTIVE' || card.status === 'FROZEN';
  return (
    <>
      <RuleRow icon="wallet-outline" label="Maximum" value={formatMoney(p.maxAmount, p.currency)} />
      <RuleRow icon="trending-down-outline" label="Spent" value={formatMoney(p.spentAmount, p.currency)} />
      <RuleRow icon="shield-checkmark-outline" label="Remaining limit" value={formatMoney(p.remainingLimit, p.currency)} emphasis />
      <Divider />
      <RuleRow icon="storefront-outline" label="Merchant" value={merchantLabel(card)} />
      <RuleRow icon="repeat-outline" label="Payments" value={paymentsUsage(card)} />
      <RuleRow
        icon="time-outline"
        label="Expiration"
        value={live ? formatTimeLeft(card.expiresAt).replace('Expires in ', 'in ') : new Date(card.expiresAt).toLocaleString()}
      />
    </>
  );
}
