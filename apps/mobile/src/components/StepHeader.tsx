import { StyleSheet, Text, View } from 'react-native';
import { colors, type } from '@/theme/tokens';

const STEPS = ['Où', 'Combien', 'Combien de fois', 'Combien de temps'] as const;

/** Progress for the 4-step creation flow: Où · Combien · Combien de fois · Combien de temps. */
export function StepHeader({ step, question }: { step: 1 | 2 | 3 | 4; question: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bars} accessibilityLabel={`Étape ${step} sur 4 : ${STEPS[step - 1]}`}>
        {STEPS.map((s, i) => (
          <View key={s} style={[styles.bar, i < step && styles.barOn]} />
        ))}
      </View>
      <Text style={styles.kicker}>Étape {step} sur 4</Text>
      <Text style={styles.question}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  bars: { flexDirection: 'row', gap: 6, alignSelf: 'center', width: '62%', marginBottom: 12 },
  bar: { flex: 1, height: 4, borderRadius: 4, backgroundColor: colors.border },
  barOn: { backgroundColor: colors.accent },
  kicker: { ...type.caption, fontSize: 13 },
  question: { ...type.title, fontSize: 21 },
});
