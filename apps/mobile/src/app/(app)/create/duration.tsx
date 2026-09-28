import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DURATION_PRESETS, formatDuration, formatMoney, MAX_DURATION_MINUTES } from '@po/shared';
import { errorMessage } from '@/api/client';
import { api } from '@/api/endpoints';
import { Button } from '@/components/Button';
import { OptionRow } from '@/components/OptionRow';
import { RuleRow } from '@/components/RuleRow';
import { Screen } from '@/components/Screen';
import { InlineError } from '@/components/States';
import { StepHeader } from '@/components/StepHeader';
import { Surface } from '@/components/Surface';
import { TextField } from '@/components/TextField';
import { useCreateCard } from '@/features/create-card/CreateCardContext';
import { paymentsLabel } from '@/lib/format';
import { colors, type } from '@/theme/tokens';

const MAX_CUSTOM_HOURS = MAX_DURATION_MINUTES / 60;

export default function Duration() {
  const { draft, update, toInput } = useCreateCard();
  const isPreset = DURATION_PRESETS.some((p) => p.minutes === draft.durationMinutes);
  const [custom, setCustom] = useState(!isPreset);
  const [hours, setHours] = useState(isPreset ? '' : String(Math.round(draft.durationMinutes / 60)));
  const customHours = Number(hours);
  const customValid = Number.isInteger(customHours) && customHours >= 1 && customHours <= MAX_CUSTOM_HOURS;

  const createDraft = useMutation({
    mutationFn: () => api.createDraft(toInput()),
    onSuccess: (card) => router.push({ pathname: '/cards/[id]/review', params: { id: card.id } }),
  });

  const setCustomHours = (value: string) => {
    setHours(value.replace(/\D/g, ''));
    const h = Number(value);
    if (Number.isInteger(h) && h >= 1 && h <= MAX_CUSTOM_HOURS) update({ durationMinutes: h * 60 });
  };

  return (
    <Screen
      title="Create a card"
      footer={
        <>
          <InlineError message={createDraft.isError ? errorMessage(createDraft.error) : null} />
          <Button
            label="Review card"
            icon="arrow-forward"
            disabled={custom && !customValid}
            loading={createDraft.isPending}
            onPress={() => createDraft.mutate()}
          />
        </>
      }
    >
      <StepHeader step={4} question="How long should it stay active?" />
      {DURATION_PRESETS.map((p) => (
        <OptionRow
          key={p.minutes}
          title={p.label}
          selected={!custom && draft.durationMinutes === p.minutes}
          onPress={() => {
            setCustom(false);
            update({ durationMinutes: p.minutes });
          }}
        />
      ))}
      <OptionRow title="Custom" description="Choose a number of hours." selected={custom} onPress={() => setCustom(true)} />
      {custom ? (
        <TextField
          label="Hours"
          value={hours}
          onChangeText={setCustomHours}
          keyboardType="number-pad"
          placeholder="e.g. 48"
          error={hours && !customValid ? `Between 1 and ${MAX_CUSTOM_HOURS} hours` : null}
        />
      ) : null}

      <Surface>
        <View style={styles.summaryHead}>
          <Text style={type.heading}>Your card rules</Text>
          <Pressable accessibilityRole="button" hitSlop={10} onPress={() => router.dismissAll()}>
            <Text style={styles.edit}>Edit</Text>
          </Pressable>
        </View>
        <RuleRow icon="wallet-outline" label="Maximum" value={formatMoney(draft.maxAmount)} />
        <RuleRow
          icon="storefront-outline"
          label="Merchant"
          value={draft.restrictToMerchant && draft.merchant ? draft.merchant.name : 'Anywhere'}
        />
        <RuleRow icon="repeat-outline" label="Payments" value={paymentsLabel(draft.maxTransactionCount)} />
        <RuleRow icon="time-outline" label="Duration" value={formatDuration(draft.durationMinutes)} />
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  edit: { color: colors.green, fontWeight: '800' },
});
