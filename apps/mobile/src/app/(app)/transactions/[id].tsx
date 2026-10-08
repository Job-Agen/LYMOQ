import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { formatMoney } from '@mesura/shared';
import { errorMessage } from '@/api/client';
import { useTransaction } from '@/api/queries';
import { MerchantAvatar } from '@/components/MerchantAvatar';
import { Divider, RuleRow } from '@/components/RuleRow';
import { Screen } from '@/components/Screen';
import { TransactionStatusBadge } from '@/components/StatusBadge';
import { ErrorState, Skeleton } from '@/components/States';
import { Surface } from '@/components/Surface';
import { formatDateTime } from '@/lib/format';
import { colors, radius, type } from '@/theme/tokens';

export default function TransactionDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tx = useTransaction(id);
  const t = tx.data;

  return (
    <Screen title="Transaction">
      {tx.isPending ? (
        <Skeleton height={320} />
      ) : tx.isError || !t ? (
        <ErrorState message={errorMessage(tx.error)} onRetry={() => void tx.refetch()} />
      ) : (
        <>
          <View style={styles.head}>
            <MerchantAvatar name={t.merchantName} slug={t.merchant} size={64} />
            <Text style={type.heading}>{t.merchantName}</Text>
            <Text style={[styles.amount, t.status === 'BLOCKED' && styles.struck]}>{formatMoney(t.amount, t.currency)}</Text>
            <View>
              <TransactionStatusBadge status={t.status} />
            </View>
          </View>
          {t.status === 'BLOCKED' ? (
            <View style={styles.blocked}>
              <Text style={styles.blockedTitle}>Vos règles ont protégé votre argent.</Text>
              <Text style={styles.blockedText}>{t.declineMessage}</Text>
            </View>
          ) : null}
          <Surface>
            <RuleRow icon="storefront-outline" label="Marchand" value={t.merchantName} />
            <RuleRow icon="cash-outline" label="Montant" value={formatMoney(t.amount, t.currency)} />
            <RuleRow icon="calendar-outline" label="Date" value={formatDateTime(t.createdAt)} />
            <RuleRow icon="card-outline" label="Carte" value={`${t.cardLabel} · •••• ${t.cardLast4 ?? '••••'}`} />
            <Divider />
            <RuleRow icon="shield-checkmark-outline" label="Statut" value={t.status === 'APPROVED' ? 'Accepté' : t.status === 'BLOCKED' ? 'Bloqué' : t.status} />
            {t.declineMessage ? <RuleRow icon="alert-circle-outline" label="Motif" value={t.declineMessage} /> : null}
          </Surface>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  amount: { fontSize: 30, fontWeight: '900', color: colors.text },
  struck: { color: colors.muted, textDecorationLine: 'line-through' },
  blocked: { backgroundColor: colors.dangerSoft, borderRadius: radius.md, padding: 16, gap: 4 },
  blockedTitle: { color: colors.danger, fontWeight: '900', fontSize: 16 },
  blockedText: { color: colors.danger, fontWeight: '600' },
});
