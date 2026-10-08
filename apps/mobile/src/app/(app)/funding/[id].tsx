import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { formatMoney, MOBILE_MONEY_PROVIDER_LABELS } from '@mesura/shared';
import { errorMessage } from '@/api/client';
import { api } from '@/api/endpoints';
import { keys, useFunding } from '@/api/queries';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ErrorState, InfoNote, InlineError, Skeleton } from '@/components/States';
import { colors, radius, type } from '@/theme/tokens';

/** Mobile Money confirmation: polls the funding until the (fake) user approves it. */
export default function FundingConfirmation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useQueryClient();
  const funding = useFunding(id);
  const f = funding.data;

  const confirm = useMutation({
    mutationFn: () => api.sandbox.confirmFunding(id),
    onSuccess: (data) => client.setQueryData(keys.funding(id), data),
  });

  useEffect(() => {
    if (f?.status === 'CONFIRMED') {
      void client.invalidateQueries({ queryKey: keys.cards });
      // Leave the creation flow behind: back from "Card created" goes Home.
      router.dismissAll();
      router.push({ pathname: '/cards/[id]/created', params: { id: f.cardId } });
    }
  }, [f?.status, f?.cardId, client]);

  const failed = f?.status === 'FAILED' || f?.status === 'EXPIRED';

  const changeMethod = () => {
    if (f) router.replace({ pathname: '/cards/[id]/fund', params: { id: f.cardId } });
  };

  return (
    <Screen
      back
      footer={
        f && !failed ? (
          <>
            <InlineError message={confirm.isError ? errorMessage(confirm.error) : null} />
            <Button label="Changer de moyen de paiement" variant="link" onPress={changeMethod} />
            <Button label="Simuler la confirmation (sandbox)" icon="flask-outline" variant="secondary" loading={confirm.isPending} onPress={() => confirm.mutate()} />
          </>
        ) : failed ? (
          <Button label="Réessayer" onPress={changeMethod} />
        ) : null
      }
    >
      <Text style={[type.title, styles.center]}>Confirmez le paiement</Text>
      {funding.isPending ? (
        <Skeleton height={260} />
      ) : funding.isError || !f ? (
        <ErrorState message={errorMessage(funding.error)} onRetry={() => void funding.refetch()} />
      ) : (
        <View style={styles.body}>
          <View style={styles.illustration} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={styles.blob} />
            <Ionicons name={failed ? 'close-circle-outline' : 'phone-portrait-outline'} size={84} color={failed ? colors.danger : colors.forest} />
            {failed ? null : (
              <View style={styles.bubble}>
                <Ionicons name="chatbox-ellipses" size={30} color={colors.accent} />
              </View>
            )}
          </View>
          <Text style={[type.body, { color: colors.muted }]}>
            Une demande {MOBILE_MONEY_PROVIDER_LABELS[f.provider]} a été envoyée au
          </Text>
          <Text style={styles.phone}>{f.phone.replace(/^\+228(\d{2})(\d{2})(\d{2})(\d{2})$/, '+228 $1 $2 $3 $4')}</Text>
          <View style={styles.amount}>
            <Text style={styles.amountText}>{formatMoney(f.total, f.currency)}</Text>
          </View>
          {failed ? (
            <Text style={styles.failed}>
              {f.status === 'EXPIRED' ? "La demande a expiré avant d'être validée." : "Le paiement n'a pas abouti."} Rien n'a été débité.
            </Text>
          ) : (
            <View style={styles.waiting} accessibilityLiveRegion="polite">
              <ActivityIndicator color={colors.accent} size="large" />
              <Text style={styles.waitingText}>En attente de confirmation…</Text>
            </View>
          )}
          <InfoNote tone="mint">
            Vérifiez votre téléphone et validez la demande de paiement dans votre application Mobile Money. Mesura ne vous demande jamais votre code PIN.
          </InfoNote>
          <InfoNote tone="sandbox">Sandbox : la demande se confirme toute seule après quelques secondes.</InfoNote>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center', marginTop: 4 },
  body: { alignItems: 'center', gap: 12 },
  illustration: { width: 220, height: 140, alignItems: 'center', justifyContent: 'center' },
  blob: { position: 'absolute', width: 210, height: 110, borderRadius: 70, backgroundColor: colors.mint },
  bubble: { position: 'absolute', right: 52, top: 26 },
  phone: { ...type.title, fontSize: 21 },
  amount: { backgroundColor: colors.mint, borderRadius: radius.md, paddingHorizontal: 36, paddingVertical: 12 },
  amountText: { fontSize: 24, fontWeight: '800', color: colors.text },
  waiting: { alignItems: 'center', gap: 8, marginVertical: 6 },
  waitingText: { color: colors.green, fontWeight: '800' },
  failed: { color: colors.danger, fontWeight: '700', textAlign: 'center' },
});
