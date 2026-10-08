import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { errorMessage } from '@/api/client';
import { useMerchants } from '@/api/queries';
import { Button } from '@/components/Button';
import { MerchantAvatar } from '@/components/MerchantAvatar';
import { OptionRow } from '@/components/OptionRow';
import { Screen } from '@/components/Screen';
import { ErrorState, InfoNote, ListSkeleton } from '@/components/States';
import { StepHeader } from '@/components/StepHeader';
import { useCreateCard } from '@/features/create-card/CreateCardContext';
import { colors, radius, type } from '@/theme/tokens';

function OptionIcon({ name }: { name: ComponentProps<typeof Ionicons>['name'] }) {
  return (
    <View style={styles.optionIcon}>
      <Ionicons name={name} size={22} color={colors.forest} />
    </View>
  );
}

export default function Where() {
  const { draft, update } = useCreateCard();
  const merchants = useMerchants();
  const canContinue = !draft.restrictToMerchant || draft.merchant !== null;

  return (
    <Screen
      title="Créer une carte sécurisée"
      footer={<Button label="Continuer" icon="arrow-forward" disabled={!canContinue} onPress={() => router.push('/create/amount')} />}
    >
      <StepHeader step={1} question="Où utiliserez-vous cette carte ?" />
      <OptionRow
        title="Partout"
        description="Utilisez cette carte sur n'importe quel site ou chez n'importe quel marchand."
        selected={!draft.restrictToMerchant}
        onPress={() => update({ restrictToMerchant: false })}
        leading={<OptionIcon name="globe-outline" />}
      />
      <OptionRow
        title="Un marchand précis"
        note="(selon disponibilité)"
        description="Limitez cette carte à un seul marchand pour plus de sécurité."
        selected={draft.restrictToMerchant}
        onPress={() => update({ restrictToMerchant: true })}
        leading={<OptionIcon name="storefront-outline" />}
      />

      {draft.restrictToMerchant ? (
        <>
          <Text style={type.heading}>Choisissez le marchand</Text>
          {merchants.isPending ? (
            <ListSkeleton rows={2} rowHeight={88} />
          ) : merchants.isError ? (
            <ErrorState message={errorMessage(merchants.error)} onRetry={() => void merchants.refetch()} />
          ) : (
            <View style={styles.grid}>
              {(merchants.data ?? []).map((m) => {
                const selected = draft.merchant?.id === m.id;
                return (
                  <Pressable
                    key={m.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={m.name}
                    onPress={() => update({ merchant: m })}
                    style={[styles.tile, selected && styles.tileOn]}
                  >
                    <MerchantAvatar name={m.name} slug={m.slug} />
                    <Text style={styles.tileText}>{m.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </>
      ) : null}
      <InfoNote tone="plain">
        Les restrictions par marchand sont disponibles lorsque le réseau de la carte et l'émetteur partenaire les prennent en charge.
      </InfoNote>
    </Screen>
  );
}

const styles = StyleSheet.create({
  optionIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    flexBasis: '30%',
    flexGrow: 1,
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tileOn: { borderColor: colors.accent, backgroundColor: '#F1F8F4' },
  tileText: { fontWeight: '800', color: colors.text },
});
