import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { VirtualCard } from '@/components/VirtualCard';
import { colors, radius, type } from '@/theme/tokens';

const PRINCIPLES = [
  { key: 'HOW MUCH', text: 'Set the maximum the card can spend.' },
  { key: 'WHERE', text: 'Lock it to one merchant, or use it anywhere.' },
  { key: 'HOW MANY', text: 'Allow one payment, five, or more.' },
  { key: 'HOW LONG', text: 'It switches off on its own when time is up.' },
];

export default function Onboarding() {
  return (
    <Screen
      back={false}
      footer={
        <>
          <Button label="Get started" icon="arrow-forward" onPress={() => router.push({ pathname: '/auth', params: { mode: 'signup' } })} />
          <Button label="I already have an account" variant="outline" onPress={() => router.push({ pathname: '/auth', params: { mode: 'login' } })} />
        </>
      }
    >
      <Text style={styles.brand}>PÔ</Text>
      <Text style={type.display}>Your money.{'\n'}Your rules.</Text>
      <Text style={[type.body, { color: colors.muted }]}>
        Create a secure virtual card for one online payment — and decide exactly how it can be used.
      </Text>
      <VirtualCard label="Canva card" last4="4821" />
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
  brand: { fontSize: 28, fontWeight: '900', color: colors.forest },
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
