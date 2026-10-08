import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, TOUCH, type } from '@/theme/tokens';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
  hint?: string;
  /** Small element shown inside the field, before the text (e.g. a flag). */
  leading?: ReactNode;
  /** Section-style label (bigger, bolder), as on the funding screen. */
  strongLabel?: boolean;
}

export function TextField({ label, error, hint, leading, strongLabel, style, ...input }: TextFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, strongLabel && type.heading]}>{label}</Text>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor="#A2ABA6"
          style={[styles.input, style]}
          {...input}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={type.caption}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { ...type.label, color: colors.text },
  field: {
    minHeight: TOUCH,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  fieldError: { borderColor: colors.danger },
  leading: { paddingLeft: 14 },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: TOUCH - 3,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  error: { color: colors.danger, fontSize: 13, fontWeight: '600' },
});
