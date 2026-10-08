import { router, useLocalSearchParams } from 'expo-router';
import { errorMessage } from '@/api/client';
import { useCard } from '@/api/queries';
import { Button } from '@/components/Button';
import { CardRules } from '@/components/CardRules';
import { PriceSummary } from '@/components/PriceSummary';
import { Screen } from '@/components/Screen';
import { ErrorState, InfoNote, Skeleton } from '@/components/States';
import { Surface } from '@/components/Surface';
import { VirtualCard } from '@/components/VirtualCard';

export default function Review() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = useCard(id);
  const c = card.data;

  return (
    <Screen
      title="Vérifiez votre carte"
      footer={
        c ? (
          <Button
            label="Recharger la carte"
            icon="arrow-forward"
            disabled={c.status !== 'PENDING_FUNDING'}
            onPress={() => router.push({ pathname: '/cards/[id]/fund', params: { id } })}
          />
        ) : null
      }
    >
      {card.isPending ? (
        <>
          <Skeleton height={200} />
          <Skeleton height={180} />
        </>
      ) : card.isError || !c ? (
        <ErrorState message={errorMessage(card.error)} onRetry={() => void card.refetch()} />
      ) : (
        <>
          <VirtualCard label={c.label} last4={null} />
          <Surface>
            <CardRules card={c} mode="before" />
          </Surface>
          <InfoNote tone="plain">Après le paiement, votre carte suivra automatiquement ces règles de sécurité.</InfoNote>
          <Surface>
            <PriceSummary pricing={c.pricing} />
          </Surface>
        </>
      )}
    </Screen>
  );
}
