import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AMOUNT_PRESETS, createCardDraftSchema, formatIllustrativeUsd, formatNumber } from '@mesura/shared';
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
  const input = useRef<TextInput>(null);
  const value = Number(text.replace(/\D/g, '') || '0');
  const check = amountSchema.safeParse(value);

  return (
    <Screen
      title="Créer une carte sécurisée"
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
        <View style={styles.amountRow}>
          <TextInput
            ref={input}
            accessibilityLabel="Montant maximum en FCFA"
            value={value ? formatNumber(value) : ''}
            onChangeText={setText}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={colors.border}
            style={styles.input}
            maxLength={9}
          />
          <View style={styles.currency}>
            <Text style={styles.currencyText}>FCFA</Text>
          </View>
        </View>
        <Text style={type.caption}>
          {value > 0 ? formatIllustrativeUsd(value) : '≈ 0,00 $'} (taux de change indicatif)
        </Text>
      </View>
      <InlineError message={value > 0 && !check.success ? (check.error.issues[0]?.message ?? null) : null} />
      <View style={styles.grid}>
        {AMOUNT_PRESETS.map((preset) => (
          <Pressable
            key={preset}
            accessibilityRole="button"
            accessibilityState={{ selected: preset === value }}
            onPress={() => setText(String(preset))}
            style={[styles.chip, preset === value && styles.chipOn]}
          >
            <Text style={[styles.chipText, preset === value && styles.chipTextOn]}>{formatNumber(preset)}</Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityHint="Saisir un autre montant"
          onPress={() => input.current?.focus()}
          style={styles.chip}
        >
          <Text style={styles.chipText}>Autre</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: radius.lg, backgroundColor: colors.surface, padding: 20, gap: 10 },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: { flex: 1, minWidth: 0, fontSize: 38, fontWeight: '800', color: colors.text, minHeight: 56 },
  currency: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.sm, backgroundColor: colors.mint },
  currencyText: { fontSize: 15, fontWeight: '800', color: colors.forest },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexBasis: '30%',
    flexGrow: 1,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.fill,
    borderWidth: 1.5,
    borderColor: colors.fill,
  },
  chipOn: { borderColor: colors.accent, backgroundColor: '#F1F8F4' },
  chipText: { fontWeight: '600', color: colors.text, fontSize: 15 },
  chipTextOn: { color: colors.forest, fontWeight: '800' },
});
