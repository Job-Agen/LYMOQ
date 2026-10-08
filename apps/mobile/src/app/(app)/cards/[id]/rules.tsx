import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { formatMoney, updateCardRulesSchema, type UpdateCardRulesInput } from '@mesura/shared';
import { errorMessage } from '@/api/client';
import { api } from '@/api/endpoints';
import { useCard, useCardAction } from '@/api/queries';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ErrorState, InfoNote, InlineError, Skeleton } from '@/components/States';
import { TextField } from '@/components/TextField';
import { colors, type } from '@/theme/tokens';

/** Rules can only be tightened after funding — the API enforces it too. */
export default function ManageRules() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = useCard(id);
  const save = useCardAction((input: UpdateCardRulesInput) => api.updateRules(id, input));
  const [maxAmount, setMaxAmount] = useState('');
  const [maxCount, setMaxCount] = useState('');
  const c = card.data;

  const input: UpdateCardRulesInput = {
    ...(maxAmount ? { maxAmount: Number(maxAmount) } : {}),
    ...(maxCount ? { maxTransactionCount: Number(maxCount) } : {}),
  };
  const valid = updateCardRulesSchema.safeParse(input).success;

  return (
    <Screen
      title="Gérer les règles"
      footer={
        <>
          <InlineError message={save.isError ? errorMessage(save.error) : null} />
          <Button label="Enregistrer les règles plus strictes" disabled={!valid} loading={save.isPending} onPress={() => save.mutate(input, { onSuccess: () => router.back() })} />
        </>
      }
    >
      {card.isPending ? (
        <Skeleton height={240} />
      ) : card.isError || !c ? (
        <ErrorState message={errorMessage(card.error)} onRetry={() => void card.refetch()} />
      ) : (
        <>
          <Text style={type.title}>Rendre cette carte plus stricte</Text>
          <Text style={[type.body, { color: colors.muted }]}>
            Vous pouvez baisser le plafond ou autoriser moins de paiements. Pour assouplir une règle, créez une nouvelle carte.
          </Text>
          <TextField
            label="Nouveau plafond (FCFA)"
            value={maxAmount}
            onChangeText={(v) => setMaxAmount(v.replace(/\D/g, ''))}
            keyboardType="number-pad"
            placeholder={String(c.policy.maxAmount)}
            hint={`Actuellement ${formatMoney(c.policy.maxAmount)} · déjà dépensé ${formatMoney(c.policy.spentAmount)}`}
          />
          <TextField
            label="Nouveau nombre de paiements"
            value={maxCount}
            onChangeText={(v) => setMaxCount(v.replace(/\D/g, ''))}
            keyboardType="number-pad"
            placeholder={c.policy.maxTransactionCount === null ? 'Illimité' : String(c.policy.maxTransactionCount)}
            hint={`${c.policy.currentTransactionCount} paiement(s) déjà effectué(s)`}
          />
          <InfoNote>Le marchand et l'expiration restent inchangés. Vous pouvez geler ou clôturer la carte à tout moment.</InfoNote>
        </>
      )}
    </Screen>
  );
}
