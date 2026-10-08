import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { errorMessage } from '@/api/client';
import { useCard } from '@/api/queries';
import { Button } from '@/components/Button';
import { CardRules } from '@/components/CardRules';
import { Screen } from '@/components/Screen';
import { ErrorState, Skeleton } from '@/components/States';
import { Surface } from '@/components/Surface';
import { VirtualCard } from '@/components/VirtualCard';
import { colors, type } from '@/theme/tokens';

export default function Created() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = useCard(id);
  const c = card.data;

  return (
    <Screen
      back={false}
      footer={
        <>
          <Button label="Voir la carte" onPress={() => router.replace({ pathname: '/cards/[id]', params: { id } })} />
          <Button label="Terminé" variant="secondary" onPress={() => router.dismissAll()} />
        </>
      }
    >
      <View style={styles.hero}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={44} color={colors.onDark} />
        </View>
        <Text style={type.title}>Votre carte est prête !</Text>
        <Text style={[type.body, { color: colors.muted, textAlign: 'center' }]}>Votre carte sécurisée est active et suit vos règles.</Text>
      </View>
      {card.isPending ? (
        <Skeleton height={200} />
      ) : card.isError || !c ? (
        <ErrorState message={errorMessage(card.error)} onRetry={() => void card.refetch()} />
      ) : (
        <>
          <VirtualCard label={c.label} last4={c.last4} status={c.status} />
          <Surface>
            <CardRules card={c} mode="live" />
          </Surface>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 8, paddingTop: 12 },
  check: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
});
