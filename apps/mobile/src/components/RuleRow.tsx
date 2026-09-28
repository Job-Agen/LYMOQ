import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, type } from '@/theme/tokens';

interface RuleRowProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  emphasis?: boolean;
}

export function RuleRow({ icon, label, value, emphasis }: RuleRowProps) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={17} color={colors.green} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, emphasis && styles.emphasis]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, gap: 12 },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...type.body, color: colors.muted, flex: 1 },
  value: { ...type.body, fontWeight: '800', textAlign: 'right', flexShrink: 1 },
  emphasis: { fontSize: 18, fontWeight: '900' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
});
