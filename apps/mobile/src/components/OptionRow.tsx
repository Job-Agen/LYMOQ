import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, TOUCH, type } from '@/theme/tokens';

interface OptionRowProps {
  title: string;
  /** Small muted line right under the title, e.g. "(where supported)". */
  note?: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  leading?: ReactNode;
  /** Radio on the left for plain lists, on the right when the row has a leading icon. */
  radio?: 'left' | 'right';
  /** Tighter rows for long lists (durations). */
  dense?: boolean;
}

export function OptionRow({ title, note, description, selected, onPress, leading, radio = 'right', dense }: OptionRowProps) {
  const radioIcon = (
    <Ionicons
      name={selected ? 'radio-button-on' : 'radio-button-off'}
      size={24}
      color={selected ? colors.green : colors.border}
    />
  );
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.row, dense && styles.dense, selected && styles.selected, pressed && { opacity: 0.85 }]}
    >
      {radio === 'left' ? radioIcon : null}
      {leading}
      <View style={styles.text}>
        <Text style={[styles.title, dense && styles.denseTitle]}>{title}</Text>
        {note ? <Text style={styles.note}>{note}</Text> : null}
        {description ? <Text style={[styles.description, note ? { marginTop: 6 } : null]}>{description}</Text> : null}
      </View>
      {radio === 'right' ? radioIcon : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: TOUCH + 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dense: { minHeight: TOUCH - 4, paddingVertical: 10 },
  selected: { borderColor: colors.accent, backgroundColor: '#F1F8F4' },
  text: { flex: 1, gap: 2 },
  title: { ...type.body, fontWeight: '800', fontSize: 16 },
  denseTitle: { fontWeight: '600' },
  note: { ...type.caption, fontSize: 13 },
  description: { ...type.caption, fontSize: 13, lineHeight: 18 },
});
