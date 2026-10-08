import { StyleSheet, Text, View } from 'react-native';
import { formatDuration, formatIllustrativeUsd, formatMoney, type CardDto } from '@mesura/shared';
import { colors, type } from '@/theme/tokens';
import { formatDate, formatTimeLeft, merchantLabel, paymentsLabel, paymentsUsage } from '@/lib/format';
import { RuleRow } from './RuleRow';

/**
 * "before" = the rules as chosen (review), "created" = short summary right after funding,
 * "live" = usage of an issued card (details), with a spending bar.
 */
export function CardRules({ card, mode }: { card: CardDto; mode: 'before' | 'created' | 'live' }) {
  const p = card.policy;
  const live = card.status === 'ACTIVE' || card.status === 'FROZEN';
  const timeLeft = live ? formatTimeLeft(card.expiresAt).replace('Expire dans ', '') : formatDate(card.expiresAt, true);

  if (mode === 'before') {
    return (
      <>
        <RuleRow icon="wallet-outline" label="Plafond" value={formatMoney(p.maxAmount, p.currency)} hint={formatIllustrativeUsd(p.maxAmount)} />
        <RuleRow icon="storefront-outline" label="Marchand" value={p.merchantRestriction?.name ?? 'Partout'} separated />
        <RuleRow icon="repeat-outline" label="Paiements" value={paymentsLabel(p.maxTransactionCount)} separated />
        <RuleRow icon="time-outline" label="Durée" value={formatDuration(p.durationMinutes)} separated />
      </>
    );
  }

  if (mode === 'created') {
    return (
      <>
        <RuleRow icon="wallet-outline" label="Plafond" value={formatMoney(p.maxAmount, p.currency)} accent />
        <RuleRow icon="storefront-outline" label="Marchand" value={p.merchantRestriction?.name ?? 'Partout'} accent separated />
        <RuleRow icon="repeat-outline" label="Paiements" value={paymentsLabel(p.maxTransactionCount)} accent separated />
        <RuleRow icon="time-outline" label="Expire dans" value={timeLeft} accent separated />
      </>
    );
  }

  const usedShare = p.maxAmount > 0 ? Math.min(1, p.spentAmount / p.maxAmount) : 0;
  return (
    <>
      <Text style={styles.title}>Règles de sécurité</Text>
      <RuleRow label="Plafond" value={formatMoney(p.maxAmount, p.currency)} />
      <View
        style={styles.track}
        accessible
        accessibilityLabel={`${Math.round(usedShare * 100)} % du plafond utilisé`}
      >
        <View style={[styles.fill, { width: `${usedShare * 100}%` }]} />
      </View>
      <RuleRow label="Dépensé" value={formatMoney(p.spentAmount, p.currency)} />
      <RuleRow label="Plafond restant" value={formatMoney(p.remainingLimit, p.currency)} separated />
      <RuleRow label="Marchand" value={merchantLabel(card)} separated />
      <RuleRow label="Paiements" value={paymentsUsage(card)} separated />
      <RuleRow label="Expiration" value={live ? timeLeft : formatDate(card.expiresAt, true)} separated />
    </>
  );
}

const styles = StyleSheet.create({
  title: { ...type.heading, marginBottom: 2 },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.fill, overflow: 'hidden', marginBottom: 4 },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.accent },
});
