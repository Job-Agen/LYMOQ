import { StyleSheet, Text, View } from 'react-native';
import type { CardStatus } from '@po/shared';
import { STATUS_LABEL } from '@/lib/format';
import { colors, radius } from '@/theme/tokens';

interface VirtualCardProps {
  label: string;
  /** Sandbox masked representation only. null while the card is not issued yet. */
  last4: string | null;
  status?: CardStatus;
}

/** Masked card visual. PÔ never has — and therefore never shows — a real PAN or CVV. */
export function VirtualCard({ label, last4, status }: VirtualCardProps) {
  const inactive = status && status !== 'ACTIVE' && status !== 'PENDING_FUNDING';
  return (
    <View
      style={[styles.card, inactive && styles.inactive]}
      accessible
      accessibilityLabel={`${label}, Visa card ending ${last4 ?? 'not issued yet'}${status ? `, ${STATUS_LABEL[status]}` : ''}`}
    >
      <View style={[styles.orb, styles.orbA]} />
      <View style={[styles.orb, styles.orbB]} />
      <View style={styles.top}>
        <Text style={styles.brand}>PÔ</Text>
        <Text style={styles.network}>VISA</Text>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.label} numberOfLines={1}>
          {label.toUpperCase()}
        </Text>
        <Text style={styles.number}>•••• •••• •••• {last4 ?? '••••'}</Text>
        <View style={styles.meta}>
          <View>
            <Text style={styles.metaLabel}>EXP</Text>
            <Text style={styles.metaValue}>••/••</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>CVV</Text>
            <Text style={styles.metaValue}>•••</Text>
          </View>
          {inactive && status ? <Text style={styles.stamp}>{STATUS_LABEL[status].toUpperCase()}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1.586,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    borderRadius: radius.lg + 2,
    backgroundColor: colors.forest,
    padding: 22,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  inactive: { backgroundColor: '#3F4A45' },
  orb: { position: 'absolute', borderRadius: 999, backgroundColor: colors.accent },
  orbA: { width: 260, height: 260, right: -90, top: -120, opacity: 0.35 },
  orbB: { width: 180, height: 180, right: 30, bottom: -110, opacity: 0.18 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: colors.onDark, fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  network: { color: colors.onDark, fontSize: 20, fontWeight: '900', fontStyle: 'italic' },
  bottom: { gap: 6 },
  label: { color: colors.onDarkMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  number: { color: colors.onDark, fontSize: 19, fontWeight: '800', letterSpacing: 2 },
  meta: { flexDirection: 'row', gap: 26, alignItems: 'flex-end' },
  metaLabel: { color: colors.onDarkMuted, fontSize: 10, fontWeight: '800' },
  metaValue: { color: colors.onDark, fontSize: 14, fontWeight: '800' },
  stamp: { marginLeft: 'auto', color: colors.onDark, fontSize: 13, fontWeight: '900', letterSpacing: 1.5 },
});
