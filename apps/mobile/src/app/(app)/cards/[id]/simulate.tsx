import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatIllustrativeUsd, simulateTransactionSchema } from '@po/shared';
import { errorMessage } from '@/api/client';
import { api } from '@/api/endpoints';
import { useCard, useInvalidateActivity, useMerchants } from '@/api/queries';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { InfoNote, InlineError } from '@/components/States';
import { TextField } from '@/components/TextField';
import { colors, radius, type } from '@/theme/tokens';

/** Sandbox tool: plays the role of a merchant charging this card. */
export default function SimulatePayment() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = useCard(id);
  const merchants = useMerchants();
  const invalidate = useInvalidateActivity();
  const [merchant, setMerchant] = useState(card.data?.policy.merchantRestriction?.name ?? 'Canva');
  const [amount, setAmount] = useState('5650');

  const input = { cardId: id, merchant, amount: Number(amount), currency: 'XOF' as const };
  const valid = simulateTransactionSchema.safeParse(input).success;

  const pay = useMutation({
    mutationFn: () => api.sandbox.simulateTransaction(input),
    onSuccess: async (result) => {
      await invalidate();
      router.replace({ pathname: '/payment-result/[id]', params: { id: result.transaction.id } });
    },
  });

  return (
    <Screen
      title="Simulate a payment"
      footer={
        <>
          <InlineError message={pay.isError ? errorMessage(pay.error) : null} />
          <Button label="Charge this card" disabled={!valid} loading={pay.isPending} onPress={() => pay.mutate()} />
        </>
      }
    >
      <InfoNote tone="sandbox">You are acting as an online merchant. The card's rules decide if the payment goes through.</InfoNote>
      <Text style={type.label}>MERCHANT</Text>
      <View style={styles.chips}>
        {(merchants.data ?? []).map((m) => (
          <Pressable
            key={m.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: merchant === m.name }}
            onPress={() => setMerchant(m.name)}
            style={[styles.chip, merchant === m.name && styles.chipOn]}
          >
            <Text style={[styles.chipText, merchant === m.name && styles.chipTextOn]}>{m.name}</Text>
          </Pressable>
        ))}
      </View>
      <TextField label="Or type any merchant" value={merchant} onChangeText={setMerchant} autoCapitalize="words" />
      <TextField
        label="Amount (FCFA)"
        value={amount}
        onChangeText={(v) => setAmount(v.replace(/\D/g, ''))}
        keyboardType="number-pad"
        hint={Number(amount) > 0 ? `${formatIllustrativeUsd(Number(amount))} · illustrative` : undefined}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.forest, borderColor: colors.forest },
  chipText: { fontWeight: '800', color: colors.text },
  chipTextOn: { color: colors.onDark },
});
