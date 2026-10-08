import { StyleSheet, Text, View } from 'react-native';
import type { CardStatus, TransactionStatus } from '@mesura/shared';
import { STATUS_LABEL } from '@/lib/format';
import { colors, radius } from '@/theme/tokens';

const TONES = {
  good: { bg: colors.mint, fg: colors.green },
  bad: { bg: colors.dangerSoft, fg: colors.danger },
  cold: { bg: colors.infoSoft, fg: colors.info },
  neutral: { bg: colors.fill, fg: colors.muted },
  warn: { bg: colors.warningSoft, fg: colors.warning },
} as const;

const CARD_TONE: Record<CardStatus, keyof typeof TONES> = {
  PENDING_FUNDING: 'warn',
  ACTIVE: 'good',
  FROZEN: 'cold',
  EXPIRED: 'neutral',
  TERMINATED: 'neutral',
};

const TX_TONE: Record<TransactionStatus, keyof typeof TONES> = {
  APPROVED: 'good',
  BLOCKED: 'bad',
  PENDING: 'warn',
  FAILED: 'neutral',
};

const TX_LABEL: Record<TransactionStatus, string> = {
  APPROVED: 'Accepté',
  BLOCKED: 'Bloqué',
  PENDING: 'En attente',
  FAILED: 'Échoué',
};

function Pill({ label, tone }: { label: string; tone: keyof typeof TONES }) {
  const t = TONES[tone];
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

export const CardStatusBadge = ({ status }: { status: CardStatus }) => (
  <Pill label={STATUS_LABEL[status]} tone={CARD_TONE[status]} />
);

/** Approved payments read as plain green text; anything else stands out as a pill. */
export const TransactionStatusBadge = ({ status }: { status: TransactionStatus }) =>
  status === 'APPROVED' ? (
    <Text style={[styles.text, styles.plain]}>{TX_LABEL[status]}</Text>
  ) : (
    <Pill label={TX_LABEL[status]} tone={TX_TONE[status]} />
  );

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '800' },
  plain: { fontSize: 13, color: colors.success },
});
