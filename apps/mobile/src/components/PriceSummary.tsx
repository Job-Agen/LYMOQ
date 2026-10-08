import { formatMoney, type PricingDto } from '@mesura/shared';
import { RuleRow } from './RuleRow';

/** Funding, fee and total — plain rows, total emphasised. */
export function PriceSummary({ pricing }: { pricing: PricingDto }) {
  return (
    <>
      <RuleRow label="Recharge de la carte" value={formatMoney(pricing.funding, pricing.currency)} />
      <RuleRow label="Frais de service" value={formatMoney(pricing.fee, pricing.currency)} />
      <RuleRow label="Total" value={formatMoney(pricing.total, pricing.currency)} emphasis separated />
    </>
  );
}
