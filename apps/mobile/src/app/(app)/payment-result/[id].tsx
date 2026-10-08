import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { errorMessage } from '@/api/client';
import { useTransaction } from '@/api/queries';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ErrorState, InfoNote, Skeleton } from '@/components/States';
import { Surface } from '@/components/Surface';
import { TransactionRow } from '@/components/TransactionRow';
import { colors, type } from '@/theme/tokens';

/** Outcome of a simulated merchant payment: approved, or the "Payment blocked" state. */
export default function PaymentResult() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tx = useTransaction(id);
  const t = tx.data;
  const blocked = t?.status === 'BLOCKED';

  return (
    <Screen
      title={t ? (blocked ? 'Paiement bloqué' : 'Paiement accepté') : ''}
      footer={
        t ? (
          <>
            {/* Only reachable from this card's details: the simulator screen is replaced by this one. */}
            <Button label="Voir la carte" onPress={() => router.back()} />
            {blocked ? (
              <Button label="Créer une nouvelle carte" variant="secondary" onPress={() => router.push('/create/where')} />
            ) : (
              <Button label="Retour à l'accueil" variant="secondary" onPress={() => router.dismissAll()} />
            )}
          </>
        ) : null
      }
    >
      {tx.isPending ? (
        <Skeleton height={320} />
      ) : tx.isError || !t ? (
        <ErrorState message={errorMessage(tx.error)} onRetry={() => void tx.refetch()} />
      ) : (
        <>
          <View style={styles.hero}>
            <View style={[styles.icon, { backgroundColor: blocked ? colors.dangerSoft : colors.mint }]}>
              <Ionicons name={blocked ? 'shield' : 'checkmark-circle'} size={56} color={blocked ? colors.danger : colors.accent} />
            </View>
            <Text style={[type.title, styles.center]}>{blocked ? 'Vos règles ont protégé\nvotre argent' : 'Paiement accepté'}</Text>
            <Text style={[type.body, styles.center, { color: colors.muted }]}>
              {blocked ? t.declineMessage : 'Le paiement a respecté toutes les règles de cette carte.'}
            </Text>
          </View>
          <Surface>
            <TransactionRow tx={t} />
          </Surface>
          {blocked ? <InfoNote>Aucun argent n'a quitté la carte. Le paiement a été stoppé avant d'atteindre le marchand.</InfoNote> : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 10, paddingTop: 8 },
  icon: { width: 104, height: 104, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  center: { textAlign: 'center' },
});
