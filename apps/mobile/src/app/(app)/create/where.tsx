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

export default function Where() {
  const { draft, update } = useCreateCard();
  const merchants = useMerchants();
  const canContinue = !draft.restrictToMerchant || draft.merchant !== null;

  return (
    <Screen
      title="Créer une carte"
      footer={<Button label="Continuer" icon="arrow-forward" disabled={!canContinue} onPress={() => router.push('/create/amount')} />}
    >
      <StepHeader step={1} question="Où utiliserez-vous cette carte ?" />
      <OptionRow
        title="Un marchand précis"
        description="Seul ce marchand peut débiter la carte. L'option la plus sûre."
        selected={draft.restrictToMerchant}
        onPress={() => update({ restrictToMerchant: true })}
      />
      <OptionRow
        title="Partout"
        description="N'importe quel site ou marchand peut débiter la carte."
        selected={!draft.restrictToMerchant}
        onPress={() => update({ restrictToMerchant: false })}
      />

      {draft.restrictToMerchant ? (
        <>
          <Text style={type.label}>MARCHANDS SUGGÉRÉS</Text>
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
          <InfoNote tone="sandbox">La restriction par marchand est simulée dans cette sandbox.</InfoNote>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  tileOn: { borderColor: colors.accent, backgroundColor: colors.mint },
  tileText: { fontWeight: '800', color: colors.text },
});
