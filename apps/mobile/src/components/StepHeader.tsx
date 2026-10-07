import { StyleSheet, Text, View } from 'react-native';
import { colors, type } from '@/theme/tokens';

const STEPS = ['WHERE', 'HOW MUCH', 'HOW MANY', 'HOW LONG'] as const;

/** Progress for the 4-step creation flow: WHERE · HOW MUCH · HOW MANY · HOW LONG. */
export function StepHeader({ step, question }: { step: 1 | 2 | 3 | 4; question: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bars} accessibilityLabel={`Step ${step} of 4`}>
        {STEPS.map((s, i) => (
          <View key={s} style={[styles.bar, i < step && styles.barOn]} />
        ))}
      </View>
      <Text style={styles.kicker}>
        STEP {step} OF 4 · {STEPS[step - 1]}
      </Text>
      <Text style={styles.question}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  bars: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 5, borderRadius: 5, backgroundColor: colors.border },
  barOn: { backgroundColor: colors.accent },
  kicker: { ...type.label, letterSpacing: 1, marginTop: 6 },
  question: { ...type.title },
});
