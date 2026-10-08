import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { errorMessage } from '@/api/client';
import type { TransactionFilter } from '@/api/endpoints';
import { useTransactions } from '@/api/queries';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/States';
import { TransactionList } from '@/components/TransactionRow';
import { colors, radius } from '@/theme/tokens';

const FILTERS: { key: TransactionFilter; label: string }[] = [
  { key: 'ALL', label: 'Toutes' },
  { key: 'APPROVED', label: 'Acceptées' },
  { key: 'BLOCKED', label: 'Bloquées' },
];

export default function Activity() {
  const [filter, setFilter] = useState<TransactionFilter>('ALL');
  const txs = useTransactions(filter);

  return (
    <Screen title="Activité" back={false} edges={['top']} onRefresh={() => void txs.refetch()} refreshing={txs.isRefetching}>
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
          icon="stats-chart-outline"
          title={filter === 'BLOCKED' ? 'Rien de bloqué' : "Aucun paiement pour l'instant"}
          message={filter === 'BLOCKED' ? 'Les paiements stoppés par vos règles apparaîtront ici.' : 'Les paiements effectués avec vos cartes apparaissent ici.'}
        />
      ) : (
        <TransactionList txs={txs.data ?? []} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.fill,
  },
  chipOn: { backgroundColor: colors.green },
  chipText: { fontWeight: '700', color: colors.text },
  chipTextOn: { color: colors.onDark },
});
