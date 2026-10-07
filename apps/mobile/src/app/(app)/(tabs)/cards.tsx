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
      <Text style={type.title}>Cards</Text>
      <Button label="Create a card" icon="add" onPress={() => router.push('/create/where')} />
      {cards.isPending ? (
        <ListSkeleton rows={3} rowHeight={84} />
      ) : cards.isError ? (
        <ErrorState message={errorMessage(cards.error)} onRetry={() => void cards.refetch()} />
      ) : all.length === 0 ? (
        <EmptyState icon="card-outline" title="No cards yet" message="Each card follows the rules you set: how much, where, how many times and how long." />
      ) : (
        <>
          <SectionHeader title={`In use (${live.length})`} />
          {live.length === 0 ? <Text style={type.caption}>No active or frozen card.</Text> : live.map((c) => <CardListItem key={c.id} card={c} />)}
          {closed.length > 0 ? (
            <>
              <SectionHeader title={`Closed & expired (${closed.length})`} />
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
