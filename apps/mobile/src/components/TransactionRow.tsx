import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatMoney, type TransactionDto } from '@mesura/shared';
import { formatDateTime } from '@/lib/format';
import { colors, radius, type } from '@/theme/tokens';
import { MerchantAvatar } from './MerchantAvatar';
import { TransactionStatusBadge } from './StatusBadge';

/** One payment attempt. `separated` draws a hairline above it inside a grouped list. */
export function TransactionRow({ tx, separated }: { tx: TransactionDto; separated?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${tx.merchantName}, ${formatMoney(tx.amount, tx.currency)}, ${tx.status === 'APPROVED' ? 'accepté' : tx.status === 'BLOCKED' ? 'bloqué' : tx.status.toLowerCase()}`}
      onPress={() => router.push({ pathname: '/transactions/[id]', params: { id: tx.id } })}
      style={({ pressed }) => [styles.row, separated && styles.separated, pressed && { opacity: 0.7 }]}
    >
      <MerchantAvatar name={tx.merchantName} slug={tx.merchant} size={42} />
      <View style={styles.middle}>
        <Text style={styles.merchant} numberOfLines={1}>
          {tx.merchantName}
        </Text>
        <Text style={type.caption} numberOfLines={1}>
          {formatDateTime(tx.createdAt)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{formatMoney(tx.amount, tx.currency)}</Text>
        <TransactionStatusBadge status={tx.status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, minHeight: 64 },
  separated: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  middle: { flex: 1, gap: 2 },
  merchant: { ...type.body, fontWeight: '800' },
  right: { alignItems: 'flex-end', gap: 4 },
  amount: { ...type.body, fontWeight: '800' },
});

/** Payments grouped in a single white panel, separated by hairlines. */
export function TransactionList({ txs }: { txs: TransactionDto[] }) {
  return (
    <View style={listStyles.panel}>
      {txs.map((tx, i) => (
        <TransactionRow key={tx.id} tx={tx} separated={i > 0} />
      ))}
    </View>
  );
}

const listStyles = StyleSheet.create({
  panel: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 2 },
});
