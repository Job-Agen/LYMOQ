import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  formatDuration,
  formatMoney,
  fundCardSchema,
  MOBILE_MONEY_PROVIDER_LABELS,
  MobileMoneyProvider,
  type MobileMoneyProvider as Provider,
} from '@mesura/shared';
import { errorMessage } from '@/api/client';
import { api } from '@/api/endpoints';
import { useCard, useMe } from '@/api/queries';
import { Button } from '@/components/Button';
import { MerchantAvatar } from '@/components/MerchantAvatar';
import { OptionRow } from '@/components/OptionRow';
import { Divider, RuleRow } from '@/components/RuleRow';
import { Screen } from '@/components/Screen';
import { ErrorState, InfoNote, InlineError, Skeleton } from '@/components/States';
import { Surface } from '@/components/Surface';
import { TextField } from '@/components/TextField';
import { paymentsLabel } from '@/lib/format';
import { colors, radius, type } from '@/theme/tokens';

const PROVIDER_TINT: Record<Provider, string> = { TMONEY: '#FFCC00', FLOOZ: '#F26522', MOOV_MONEY: '#0055A5' };

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 11 || !digits.startsWith('228')) return raw;
  const n = digits.slice(3);
  return `+228 ${n.slice(0, 2)} ${n.slice(2, 4)} ${n.slice(4, 6)} ${n.slice(6, 8)}`;
}

export default function Fund() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = useCard(id);
  const me = useMe();
  const [provider, setProvider] = useState<Provider>(MobileMoneyProvider.TMONEY);
  const [phone, setPhone] = useState(me.data?.phone ? formatPhone(me.data.phone) : '+228 90 12 34 56');
  const parsedPhone = fundCardSchema.shape.phone.safeParse(phone);

  const fund = useMutation({
    mutationFn: () => api.fundCard(id, { provider, phone }),
    onSuccess: (funding) => router.replace({ pathname: '/funding/[id]', params: { id: funding.id } }),
  });

  const c = card.data;
  return (
    <Screen
      title="Rechargez votre carte"
      footer={
        c ? (
          <>
            <InlineError message={fund.isError ? errorMessage(fund.error) : null} />
            <Button
              label={`Payer ${formatMoney(c.pricing.total, c.pricing.currency)}`}
              disabled={!parsedPhone.success}
              loading={fund.isPending}
              onPress={() => fund.mutate()}
            />
          </>
        ) : null
      }
    >
      {card.isPending ? (
        <Skeleton height={320} />
      ) : card.isError || !c ? (
        <ErrorState message={errorMessage(card.error)} onRetry={() => void card.refetch()} />
      ) : (
        <>
          <Surface style={styles.summary}>
            <MerchantAvatar name={c.policy.merchantRestriction?.name ?? null} slug={c.policy.merchantRestriction?.slug} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={type.heading}>{c.label}</Text>
              <Text style={type.caption}>
                {formatMoney(c.policy.maxAmount)} · {paymentsLabel(c.policy.maxTransactionCount)} · {formatDuration(c.policy.durationMinutes)}
              </Text>
            </View>
          </Surface>

          <Text style={type.heading}>Choisissez comment payer</Text>
          {(Object.keys(MOBILE_MONEY_PROVIDER_LABELS) as Provider[]).map((p) => (
            <OptionRow
              key={p}
              title={MOBILE_MONEY_PROVIDER_LABELS[p]}
              selected={provider === p}
              onPress={() => setProvider(p)}
              leading={<View style={[styles.dot, { backgroundColor: PROVIDER_TINT[p] }]} />}
            />
          ))}

          <TextField
            label="Numéro Mobile Money"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={phone.length > 5 && !parsedPhone.success ? parsedPhone.error.issues[0]?.message : null}
          />

          <Surface>
            <RuleRow icon="card-outline" label="Recharge de la carte" value={formatMoney(c.pricing.funding)} />
            <RuleRow icon="receipt-outline" label="Frais de service" value={formatMoney(c.pricing.fee)} />
            <Divider />
            <RuleRow icon="cash-outline" label="Total" value={formatMoney(c.pricing.total)} emphasis />
          </Surface>
          <InfoNote>Vous validerez le paiement sur votre téléphone. Mesura ne vous demande jamais votre code PIN Mobile Money.</InfoNote>
          <InfoNote tone="sandbox">Sandbox : aucune vraie demande Mobile Money n'est envoyée et rien n'est débité.</InfoNote>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  dot: { width: 34, height: 34, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border },
});
