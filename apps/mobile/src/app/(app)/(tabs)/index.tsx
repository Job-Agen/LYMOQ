import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCards, useMe, useTransactions } from '@/api/queries';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/Button';
import { CardListItem } from '@/components/CardListItem';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/States';
import { TransactionList } from '@/components/TransactionRow';
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
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[type.body, { color: colors.muted }]}>{greeting()}</Text>
          <Text style={type.title}>{me.data?.name ?? ''} 👋</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Activité récente" onPress={() => router.push('/activity')} style={styles.bell}>
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Profil" onPress={() => router.push('/profile')} style={styles.avatar}>
          <Text style={styles.initial}>{(me.data?.name ?? '?').charAt(0).toUpperCase()}</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroFacet} />
        <Text style={styles.heroTitle}>Payez en ligne sans exposer plus d'argent que nécessaire.</Text>
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
        <TransactionList txs={recent} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  initial: { fontSize: 17, fontWeight: '800', color: colors.forest },
  hero: { backgroundColor: colors.forestDeep, borderRadius: radius.lg + 4, padding: 22, gap: 18, overflow: 'hidden' },
  heroFacet: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 40,
    backgroundColor: colors.accent,
    opacity: 0.2,
    right: -70,
    top: -40,
    transform: [{ rotate: '30deg' }],
  },
  heroTitle: { color: colors.onDark, fontSize: 21, fontWeight: '800', letterSpacing: -0.2, lineHeight: 27, maxWidth: '85%' },
});
