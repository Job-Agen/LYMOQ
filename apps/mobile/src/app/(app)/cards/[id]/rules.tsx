import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { formatMoney, updateCardRulesSchema, type UpdateCardRulesInput } from '@po/shared';
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
      title="Manage rules"
      footer={
        <>
          <InlineError message={save.isError ? errorMessage(save.error) : null} />
          <Button label="Save stricter rules" disabled={!valid} loading={save.isPending} onPress={() => save.mutate(input, { onSuccess: () => router.back() })} />
        </>
      }
    >
      {card.isPending ? (
        <Skeleton height={240} />
      ) : card.isError || !c ? (
        <ErrorState message={errorMessage(card.error)} onRetry={() => void card.refetch()} />
      ) : (
        <>
          <Text style={type.title}>Make this card stricter</Text>
          <Text style={[type.body, { color: colors.muted }]}>
            You can lower the limit or allow fewer payments. To loosen a rule, create a new card.
          </Text>
          <TextField
            label="New maximum (FCFA)"
            value={maxAmount}
            onChangeText={(v) => setMaxAmount(v.replace(/\D/g, ''))}
            keyboardType="number-pad"
            placeholder={String(c.policy.maxAmount)}
            hint={`Now ${formatMoney(c.policy.maxAmount)} · already spent ${formatMoney(c.policy.spentAmount)}`}
          />
          <TextField
            label="New number of payments"
            value={maxCount}
            onChangeText={(v) => setMaxCount(v.replace(/\D/g, ''))}
            keyboardType="number-pad"
            placeholder={c.policy.maxTransactionCount === null ? 'Unlimited' : String(c.policy.maxTransactionCount)}
            hint={`${c.policy.currentTransactionCount} payment(s) already made`}
          />
          <InfoNote>Merchant and expiration stay as they are. You can freeze or terminate the card at any time.</InfoNote>
        </>
      )}
    </Screen>
  );
}
