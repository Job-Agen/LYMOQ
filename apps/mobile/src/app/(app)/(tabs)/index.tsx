import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useCards, useMe, useTransactions } from '@/api/queries';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/Button';
import { CardListItem } from '@/components/CardListItem';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/States';
import { TransactionRow } from '@/components/TransactionRow';
import { greeting } from '@/lib/format';
import { colors, radius, type } from '@/theme/tokens';

export default function Home() {
  const me = useMe();
  const cards = useCards();
  const activity = useTransactions('ALL');

  const activeCards = (cards.data ?? []).filter((c) => c.status === 'ACTIVE' || c.status === 'FROZEN');
  const recent = (activity.data ?? []).slice(0, 4);
  const refresh = () => void Promise.all([cards.refetch(), activity.refetch()]);

  return (
    <Screen edges={['top']} onRefresh={refresh} refreshing={cards.isRefetching || activity.isRefetching}>
      <View>
        <Text style={[type.body, { color: colors.muted }]}>{greeting()}</Text>
        <Text style={type.title}>{me.data?.name ?? ''} 👋</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroOrb} />
        <Text style={styles.heroTitle}>Payez en ligne sans exposer plus d'argent que nécessaire.</Text>
        <Text style={styles.heroText}>Créez une carte avec son propre plafond, son marchand, ses paiements et sa durée de vie.</Text>
        <Button label="Créer une carte" icon="add" variant="light" onPress={() => router.push('/create/where')} />
      </View>

      <SectionHeader title="Cartes actives" action={activeCards.length > 0 ? { label: 'Tout voir', onPress: () => router.push('/cards') } : undefined} />
      {cards.isPending ? (
        <ListSkeleton rows={2} rowHeight={84} />
      ) : cards.isError ? (
        <ErrorState message={errorMessage(cards.error)} onRetry={() => void cards.refetch()} />
      ) : activeCards.length === 0 ? (
        <EmptyState icon="card-outline" title="Aucune carte active" message="Créez une carte pour votre prochain paiement en ligne." />
      ) : (
        activeCards.slice(0, 3).map((card) => <CardListItem key={card.id} card={card} />)
      )}

      <SectionHeader title="Activité récente" action={recent.length > 0 ? { label: 'Tout voir', onPress: () => router.push('/activity') } : undefined} />
      {activity.isPending ? (
        <ListSkeleton rows={3} rowHeight={56} />
      ) : activity.isError ? (
        <ErrorState message={errorMessage(activity.error)} onRetry={() => void activity.refetch()} />
      ) : recent.length === 0 ? (
        <EmptyState icon="pulse-outline" title="Aucune activité pour l'instant" message="Les paiements effectués avec vos cartes apparaissent ici." />
      ) : (
        <View>{recent.map((tx) => <TransactionRow key={tx.id} tx={tx} />)}</View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.forest, borderRadius: radius.lg + 4, padding: 22, gap: 12, overflow: 'hidden' },
  heroOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.accent,
    opacity: 0.25,
    right: -80,
    top: -90,
  },
  heroTitle: { color: colors.onDark, fontSize: 23, fontWeight: '900', letterSpacing: -0.3, lineHeight: 28 },
  heroText: { color: colors.onDarkMuted, fontSize: 15, fontWeight: '500' },
});
