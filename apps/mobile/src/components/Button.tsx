import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, TOUCH } from '@/theme/tokens';

type Variant = 'primary' | 'secondary' | 'neutral' | 'outline' | 'danger' | 'light' | 'link';
type IconName = ComponentProps<typeof Ionicons>['name'];

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  compact?: boolean;
}

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.green, fg: colors.onDark, border: colors.green },
  secondary: { bg: colors.mint, fg: colors.forest, border: colors.mint },
  neutral: { bg: colors.fill, fg: colors.text, border: colors.fill },
  outline: { bg: 'transparent', fg: colors.forest, border: colors.border },
  danger: { bg: colors.dangerSoft, fg: colors.danger, border: colors.dangerSoft },
  light: { bg: 'rgba(227,242,234,0.94)', fg: colors.forest, border: 'transparent' },
  link: { bg: 'transparent', fg: colors.green, border: 'transparent' },
};

/** Directional icons sit after the label ("Continuer →"); others lead it. */
const TRAILING_ICONS: readonly IconName[] = ['arrow-forward', 'chevron-forward'];

export function Button({ label, onPress, variant = 'primary', loading, disabled, icon, compact }: ButtonProps) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;
  const trailing = icon !== undefined && TRAILING_ICONS.includes(icon);
  const iconNode = icon ? <Ionicons name={icon} size={18} color={v.fg} /> : null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(inactive), busy: Boolean(loading) }}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variant === 'link' && styles.link,
        { backgroundColor: v.bg, borderColor: v.border, opacity: inactive ? 0.5 : pressed ? 0.85 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {trailing ? null : iconNode}
          <Text style={[styles.label, { color: v.fg }, variant === 'link' && styles.linkLabel, compact && styles.compactLabel]}>{label}</Text>
          {trailing ? iconNode : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: TOUCH,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  compact: { flex: 1, paddingHorizontal: 8, minHeight: 60, borderRadius: radius.lg },
  compactLabel: { fontSize: 14 },
  link: { minHeight: 44 },
  label: { fontSize: 16, fontWeight: '800', textAlign: 'center' },
  linkLabel: { fontSize: 15 },
});
