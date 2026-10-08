import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, type ComponentProps } from 'react';
import { Animated, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import { colors, radius, type } from '@/theme/tokens';
import { Button } from './Button';

export function Skeleton({ height = 16, width = '100%' }: { height?: number; width?: DimensionValue }) {
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[styles.skeleton, { height, width, opacity }]} />;
}

export function ListSkeleton({ rows = 3, rowHeight = 64 }: { rows?: number; rowHeight?: number }) {
  return (
    <View style={{ gap: 10 }} accessibilityLabel="Chargement">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} height={rowHeight} />
      ))}
    </View>
  );
}

interface EmptyStateProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={colors.green} />
      </View>
      <Text style={type.heading}>{title}</Text>
      <Text style={[type.body, styles.center, { color: colors.muted }]}>{message}</Text>
      {action ? <Button label={action.label} onPress={action.onPress} variant="secondary" /> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.error} accessibilityRole="alert">
      <Ionicons name="cloud-offline-outline" size={22} color={colors.danger} />
      <Text style={[type.body, { color: colors.danger, flex: 1 }]}>{message}</Text>
      {onRetry ? <Button label="Réessayer" onPress={onRetry} variant="outline" /> : null}
    </View>
  );
}

export function InlineError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Text accessibilityRole="alert" style={styles.inline}>
      {message}
    </Text>
  );
}

type NoteTone = 'neutral' | 'sandbox' | 'plain' | 'mint';

const NOTE_ICON: Record<NoteTone, ComponentProps<typeof Ionicons>['name']> = {
  neutral: 'information-circle-outline',
  sandbox: 'flask-outline',
  plain: 'information-circle-outline',
  mint: 'information-circle-outline',
};

/**
 * Short explanatory note. `plain` sits directly on the page (green icon), `mint` is a soft green panel,
 * `sandbox` flags simulated behaviour.
 */
export function InfoNote({
  children,
  tone = 'neutral',
  icon,
}: {
  children: string;
  tone?: NoteTone;
  icon?: ComponentProps<typeof Ionicons>['name'];
}) {
  const green = tone === 'plain' || tone === 'mint';
  const color = tone === 'sandbox' ? colors.warning : green ? colors.green : colors.muted;
  return (
    <View style={[styles.note, tone === 'sandbox' && styles.sandbox, tone === 'plain' && styles.plain, tone === 'mint' && styles.mint]}>
      <Ionicons name={icon ?? NOTE_ICON[tone]} size={18} color={color} />
      <Text style={[type.caption, styles.noteText, tone === 'sandbox' && { color: colors.warning }, tone === 'mint' && { color: colors.forest }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: { backgroundColor: '#E6EBE8', borderRadius: radius.md },
  empty: {
    alignItems: 'center',
    gap: 10,
    padding: 24,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  inline: { color: colors.danger, fontWeight: '700', fontSize: 14 },
  note: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.fill,
    alignItems: 'flex-start',
  },
  sandbox: { backgroundColor: colors.warningSoft },
  plain: { backgroundColor: 'transparent', paddingHorizontal: 4, paddingVertical: 0 },
  mint: { backgroundColor: colors.mint },
  noteText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
