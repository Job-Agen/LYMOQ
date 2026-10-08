import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AMOUNT_PRESETS, createCardDraftSchema, formatIllustrativeUsd, formatMoney, formatNumber } from '@mesura/shared';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { InlineError } from '@/components/States';
import { StepHeader } from '@/components/StepHeader';
import { useCreateCard } from '@/features/create-card/CreateCardContext';
import { colors, radius, type } from '@/theme/tokens';

const amountSchema = createCardDraftSchema.shape.maxAmount;

export default function Amount() {
  const { draft, update } = useCreateCard();
  const [text, setText] = useState(String(draft.maxAmount));
  const value = Number(text.replace(/\D/g, '') || '0');
  const check = amountSchema.safeParse(value);

  return (
    <Screen
      title="Créer une carte"
      footer={
        <Button
          label="Continuer"
          icon="arrow-forward"
          disabled={!check.success}
          onPress={() => {
            update({ maxAmount: value });
            router.push('/create/usage');
          }}
        />
      }
    >
      <StepHeader step={2} question="Combien cette carte peut-elle dépenser ?" />
      <View style={styles.box}>
        <TextInput
          accessibilityLabel="Montant maximum en FCFA"
          value={value ? formatNumber(value) : ''}
          onChangeText={setText}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={colors.border}
          style={styles.input}
          maxLength={9}
        />
        <Text style={styles.currency}>FCFA</Text>
      </View>
      <Text style={styles.fx}>
        {value > 0 ? formatIllustrativeUsd(value) : '≈ 0,00 $'} <Text style={type.caption}>· taux indicatif</Text>
      </Text>
      <InlineError message={value > 0 && !check.success ? (check.error.issues[0]?.message ?? null) : null} />
      <View style={styles.chips}>
        {AMOUNT_PRESETS.map((preset) => (
          <Pressable
            key={preset}
            accessibilityRole="button"
            onPress={() => setText(String(preset))}
            style={[styles.chip, preset === value && styles.chipOn]}
          >
            <Text style={[styles.chipText, preset === value && styles.chipTextOn]}>{formatMoney(preset)}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={type.caption}>
        C'est le maximum que la carte pourra dépenser. Un paiement au-delà du plafond restant est bloqué.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 40, fontWeight: '900', color: colors.text, minHeight: 64 },
  currency: { fontSize: 18, fontWeight: '900', color: colors.green },
  fx: { ...type.body, fontWeight: '800', color: colors.green },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  chipOn: { borderColor: colors.accent, backgroundColor: colors.mint },
  chipText: { fontWeight: '800', color: colors.text },
  chipTextOn: { color: colors.forest },
});
