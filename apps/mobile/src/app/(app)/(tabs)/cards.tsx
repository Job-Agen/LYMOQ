import { router } from 'expo-router';
import { Text } from 'react-native';
import { errorMessage } from '@/api/client';
import { useCards } from '@/api/queries';
import { Button } from '@/components/Button';
import { CardListItem } from '@/components/CardListItem';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/States';
import { type } from '@/theme/tokens';

export default function Cards() {
  const cards = useCards();
  const all = cards.data ?? [];
  const live = all.filter((c) => c.status === 'ACTIVE' || c.status === 'FROZEN');
  const closed = all.filter((c) => c.status === 'EXPIRED' || c.status === 'TERMINATED');

  return (
    <Screen edges={['top']} onRefresh={() => void cards.refetch()} refreshing={cards.isRefetching}>
      <Text style={type.title}>Cartes</Text>
      <Button label="Créer une carte" icon="add" onPress={() => router.push('/create/where')} />
      {cards.isPending ? (
        <ListSkeleton rows={3} rowHeight={84} />
      ) : cards.isError ? (
        <ErrorState message={errorMessage(cards.error)} onRetry={() => void cards.refetch()} />
      ) : all.length === 0 ? (
        <EmptyState icon="card-outline" title="Aucune carte pour l'instant" message="Chaque carte suit les règles que vous fixez : combien, où, combien de fois et combien de temps." />
      ) : (
        <>
          <SectionHeader title={`En service (${live.length})`} />
          {live.length === 0 ? <Text style={type.caption}>Aucune carte active ou gelée.</Text> : live.map((c) => <CardListItem key={c.id} card={c} />)}
          {closed.length > 0 ? (
            <>
              <SectionHeader title={`Clôturées et expirées (${closed.length})`} />
              {closed.map((c) => (
                <CardListItem key={c.id} card={c} />
              ))}
            </>
          ) : null}
        </>
      )}
    </Screen>
  );
}
