import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { formatMoney } from '@mesura/shared';
import { errorMessage } from '@/api/client';
import { useCard } from '@/api/queries';
import { Button } from '@/components/Button';
import { CardRules } from '@/components/CardRules';
import { Divider, RuleRow } from '@/components/RuleRow';
import { Screen } from '@/components/Screen';
import { ErrorState, InfoNote, Skeleton } from '@/components/States';
import { Surface } from '@/components/Surface';
import { VirtualCard } from '@/components/VirtualCard';
import { type } from '@/theme/tokens';

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
          <InfoNote>Après le paiement, votre carte suit automatiquement ces règles. Vous pourrez les durcir plus tard, jamais les assouplir.</InfoNote>
          <Surface>
            <RuleRow icon="card-outline" label="Recharge de la carte" value={formatMoney(c.pricing.funding, c.pricing.currency)} />
            <RuleRow icon="receipt-outline" label="Frais de service" value={formatMoney(c.pricing.fee, c.pricing.currency)} />
            <Divider />
            <RuleRow icon="cash-outline" label="Total" value={formatMoney(c.pricing.total, c.pricing.currency)} emphasis />
          </Surface>
          <Text style={[type.caption, { textAlign: 'center' }]}>Les frais affichés sont des valeurs indicatives de la sandbox.</Text>
        </>
      )}
    </Screen>
  );
}
