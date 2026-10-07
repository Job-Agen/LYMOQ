import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { errorMessage } from '@/api/client';
import { api } from '@/api/endpoints';
import { useCard, useCardAction, useTransactions } from '@/api/queries';
import { Button } from '@/components/Button';
import { CardRules } from '@/components/CardRules';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { CardStatusBadge } from '@/components/StatusBadge';
import { ErrorState, InfoNote, InlineError, Skeleton } from '@/components/States';
import { Surface } from '@/components/Surface';
import { TransactionRow } from '@/components/TransactionRow';
import { VirtualCard } from '@/components/VirtualCard';
import { confirmAction } from '@/lib/confirm';
import { type } from '@/theme/tokens';

const CLOSED_MESSAGE = {
  EXPIRED: 'This card has expired. It can no longer be used.',
  TERMINATED: 'This card is closed. It can no longer be used.',
} as const;

export default function CardDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = useCard(id);
  const txs = useTransactions('ALL', id);
  const freeze = useCardAction(api.freezeCard);
  const unfreeze = useCardAction(api.unfreezeCard);
  const terminate = useCardAction(api.terminateCard);
  const c = card.data;
  const actionError = freeze.error ?? unfreeze.error ?? terminate.error;

  const onTerminate = async () => {
    const ok = await confirmAction(
      'Terminate this card?',
      'The card will stop working immediately. This cannot be undone.',
      'Terminate',
    );
    if (ok) terminate.mutate(id);
  };

  return (
    <Screen
      title="Card details"
      onRefresh={() => void Promise.all([card.refetch(), txs.refetch()])}
      refreshing={card.isRefetching}
    >
      {card.isPending ? (
        <>
          <Skeleton height={210} />
          <Skeleton height={300} />
        </>
      ) : card.isError || !c ? (
        <ErrorState message={errorMessage(card.error)} onRetry={() => void card.refetch()} />
      ) : (
        <>
          <VirtualCard label={c.label} last4={c.last4} status={c.status} />
          <View style={styles.statusRow}>
            <Text style={type.body}>
              {c.label} · •••• {c.last4 ?? '••••'}
            </Text>
            <CardStatusBadge status={c.status} />
          </View>

          {c.status === 'FROZEN' ? <InfoNote>This card is frozen. Every payment is blocked until you unfreeze it.</InfoNote> : null}
          {c.status === 'EXPIRED' || c.status === 'TERMINATED' ? <InfoNote>{CLOSED_MESSAGE[c.status]}</InfoNote> : null}

          <SectionHeader title="Security rules" />
          <Surface>
            <CardRules card={c} mode="live" />
          </Surface>

          {c.status === 'ACTIVE' || c.status === 'FROZEN' ? (
            <>
              <View style={styles.actions}>
                {c.status === 'ACTIVE' ? (
                  <Button compact label="Freeze" icon="snow-outline" variant="secondary" loading={freeze.isPending} onPress={() => freeze.mutate(id)} />
                ) : (
                  <Button compact label="Unfreeze" icon="flame-outline" variant="secondary" loading={unfreeze.isPending} onPress={() => unfreeze.mutate(id)} />
                )}
                <Button compact label="Manage rules" icon="options-outline" variant="secondary" onPress={() => router.push({ pathname: '/cards/[id]/rules', params: { id } })} />
              </View>
              <Button label="Terminate" icon="close-circle-outline" variant="danger" loading={terminate.isPending} onPress={() => void onTerminate()} />
              <InlineError message={actionError ? errorMessage(actionError) : null} />
            </>
          ) : null}

          <Button
            label="Simulate an online payment"
            icon="flask-outline"
            variant="outline"
            onPress={() => router.push({ pathname: '/cards/[id]/simulate', params: { id } })}
          />

          <SectionHeader title="Card activity" />
          {txs.isPending ? (
            <Skeleton height={60} />
          ) : (txs.data ?? []).length === 0 ? (
            <Text style={type.caption}>No payment attempt yet.</Text>
          ) : (
            <View>{(txs.data ?? []).map((tx) => <TransactionRow key={tx.id} tx={tx} />)}</View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 10 },
});
