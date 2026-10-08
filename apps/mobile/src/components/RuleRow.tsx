import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, type } from '@/theme/tokens';

interface RuleRowProps {
  /** Outline icon before the label; omitted in plain summaries (fees, security rules). */
  icon?: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  /** Secondary line under the value, e.g. "≈ 26,55 $". */
  hint?: string;
  emphasis?: boolean;
  /** Green value, used on the "card created" summary. */
  accent?: boolean;
  /** Hairline above the row, to separate rows inside a list. */
  separated?: boolean;
}

export function RuleRow({ icon, label, value, hint, emphasis, accent, separated }: RuleRowProps) {
  return (
    <View style={[styles.row, separated && styles.separated]} accessible accessibilityLabel={`${label}: ${value}`}>
      {icon ? <Ionicons name={icon} size={18} color={colors.text} style={styles.icon} /> : null}
      <Text style={[styles.label, emphasis && styles.labelEmphasis]}>{label}</Text>
      <View style={styles.valueBox}>
        <Text style={[styles.value, emphasis && styles.emphasis, accent && styles.accent]} numberOfLines={2}>
          {value}
        </Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  separated: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  icon: { width: 20 },
  label: { ...type.body, color: colors.muted, flex: 1 },
  labelEmphasis: { color: colors.text, fontWeight: '800' },
  valueBox: { alignItems: 'flex-end', flexShrink: 1 },
  value: { ...type.body, fontWeight: '800', textAlign: 'right' },
  emphasis: { fontSize: 17 },
  accent: { color: colors.green },
  hint: { ...type.caption, textAlign: 'right' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
});
