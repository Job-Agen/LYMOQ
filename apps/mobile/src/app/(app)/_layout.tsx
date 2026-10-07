import { Stack } from 'expo-router';
import { colors } from '@/theme/tokens';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="create" />
      <Stack.Screen name="funding/[id]" options={{ gestureEnabled: false }} />
      <Stack.Screen name="payment-result/[id]" options={{ animation: 'fade' }} />
    </Stack>
  );
}
