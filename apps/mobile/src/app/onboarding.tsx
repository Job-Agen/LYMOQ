import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { VirtualCard } from '@/components/VirtualCard';
import { colors, radius, type } from '@/theme/tokens';

const PRINCIPLES = [
  { key: 'COMBIEN', text: 'Fixez le montant maximum que la carte peut dépenser.' },
  { key: 'OÙ', text: 'Réservez-la à un seul marchand, ou utilisez-la partout.' },
  { key: 'COMBIEN DE FOIS', text: 'Autorisez un paiement, cinq, ou plus.' },
  { key: 'COMBIEN DE TEMPS', text: "Elle se désactive toute seule à l'échéance." },
];

export default function Onboarding() {
  return (
    <Screen
      back={false}
      footer={
        <>
          <Button label="Commencer" icon="arrow-forward" onPress={() => router.push({ pathname: '/auth', params: { mode: 'signup' } })} />
          <Button label="J'ai déjà un compte" variant="outline" onPress={() => router.push({ pathname: '/auth', params: { mode: 'login' } })} />
        </>
      }
    >
      <Logo height={36} />
      <Text style={type.display}>Votre argent.{'\n'}Vos règles.</Text>
      <Text style={[type.body, { color: colors.muted }]}>
        Créez une carte virtuelle sécurisée pour un paiement en ligne, et décidez exactement comment elle peut être utilisée.
      </Text>
      <VirtualCard label="Carte Canva" last4="4821" />
      <View style={styles.grid}>
        {PRINCIPLES.map((p) => (
          <View key={p.key} style={styles.principle}>
            <Text style={styles.key}>{p.key}</Text>
            <Text style={type.caption}>{p.text}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  principle: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: 14,
    gap: 4,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  key: { fontSize: 14, fontWeight: '900', color: colors.green, letterSpacing: 0.5 },
});
