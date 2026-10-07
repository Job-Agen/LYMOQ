import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { errorMessage } from '@/api/client';
import type { TransactionFilter } from '@/api/endpoints';
import { useTransactions } from '@/api/queries';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/States';
import { TransactionRow } from '@/components/TransactionRow';
import { colors, radius, type } from '@/theme/tokens';

const FILTERS: { key: TransactionFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'BLOCKED', label: 'Blocked' },
];

export default function Activity() {
  const [filter, setFilter] = useState<TransactionFilter>('ALL');
  const txs = useTransactions(filter);

  return (
    <Screen edges={['top']} onRefresh={() => void txs.refetch()} refreshing={txs.isRefetching}>
      <Text style={type.title}>Activity</Text>
      <View style={styles.filters} accessibilityRole="tablist">
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === f.key }}
            onPress={() => setFilter(f.key)}
            style={[styles.chip, filter === f.key && styles.chipOn]}
          >
            <Text style={[styles.chipText, filter === f.key && styles.chipTextOn]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>
      {txs.isPending ? (
        <ListSkeleton rows={6} rowHeight={56} />
      ) : txs.isError ? (
        <ErrorState message={errorMessage(txs.error)} onRetry={() => void txs.refetch()} />
      ) : (txs.data ?? []).length === 0 ? (
        <EmptyState
          icon="pulse-outline"
          title={filter === 'BLOCKED' ? 'Nothing blocked' : 'No payments yet'}
          message={filter === 'BLOCKED' ? 'Payments stopped by your rules will appear here.' : 'Payments made with your cards appear here.'}
        />
      ) : (
        <View>{(txs.data ?? []).map((tx) => <TransactionRow key={tx.id} tx={tx} />)}</View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: 8 },
  chip: {
    minHeight: 40,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.forest, borderColor: colors.forest },
  chipText: { fontWeight: '800', color: colors.text },
  chipTextOn: { color: colors.onDark },
});
