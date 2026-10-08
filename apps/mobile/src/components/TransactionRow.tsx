import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatMoney, type TransactionDto } from '@mesura/shared';
import { formatDateTime } from '@/lib/format';
import { colors, type } from '@/theme/tokens';
import { MerchantAvatar } from './MerchantAvatar';
import { TransactionStatusBadge } from './StatusBadge';

export function TransactionRow({ tx }: { tx: TransactionDto }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${tx.merchantName}, ${formatMoney(tx.amount, tx.currency)}, ${tx.status === 'APPROVED' ? 'accepté' : tx.status === 'BLOCKED' ? 'bloqué' : tx.status.toLowerCase()}`}
      onPress={() => router.push({ pathname: '/transactions/[id]', params: { id: tx.id } })}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <MerchantAvatar name={tx.merchantName} slug={tx.merchant} />
      <View style={styles.middle}>
        <Text style={styles.merchant} numberOfLines={1}>
          {tx.merchantName}
        </Text>
        <Text style={type.caption} numberOfLines={1}>
          {formatDateTime(tx.createdAt)} · {tx.cardLabel}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, tx.status === 'BLOCKED' && styles.blocked]}>{formatMoney(tx.amount, tx.currency)}</Text>
        <TransactionStatusBadge status={tx.status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, minHeight: 60 },
  middle: { flex: 1, gap: 2 },
  merchant: { ...type.body, fontWeight: '800' },
  right: { alignItems: 'flex-end', gap: 4 },
  amount: { ...type.body, fontWeight: '800' },
  blocked: { color: colors.muted, textDecorationLine: 'line-through' },
});
