import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatMoney, type CardDto } from '@mesura/shared';
import { STATUS_LABEL, formatTimeLeft, paymentsLabel } from '@/lib/format';
import { colors, radius, type } from '@/theme/tokens';
import { MerchantAvatar } from './MerchantAvatar';
import { CardStatusBadge } from './StatusBadge';

export function CardListItem({ card }: { card: CardDto }) {
  const merchant = card.policy.merchantRestriction;
  const live = card.status === 'ACTIVE' || card.status === 'FROZEN';
  const spent = card.policy.spentAmount > 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${card.label}, ${STATUS_LABEL[card.status].toLowerCase()}`}
      onPress={() => router.push({ pathname: '/cards/[id]', params: { id: card.id } })}
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.8 }]}
    >
      <MerchantAvatar name={merchant?.name ?? null} slug={merchant?.slug} size={48} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {card.label}
          </Text>
          <CardStatusBadge status={card.status} />
        </View>
        <Text style={styles.amount}>{formatMoney(card.policy.maxAmount, card.policy.currency)}</Text>
        {spent ? (
          <Text style={type.caption}>{formatMoney(card.policy.remainingLimit, card.policy.currency)} restants</Text>
        ) : null}
        <Text style={type.caption}>
          {paymentsLabel(card.policy.maxTransactionCount)}
          {live ? ` · ${formatTimeLeft(card.expiresAt)}` : ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  body: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'space-between' },
  title: { ...type.body, fontWeight: '700', flexShrink: 1 },
  amount: { ...type.body, fontSize: 17, fontWeight: '800' },
});
