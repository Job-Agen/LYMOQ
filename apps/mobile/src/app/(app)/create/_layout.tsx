import { Stack } from 'expo-router';
import { CreateCardProvider } from '@/features/create-card/CreateCardContext';
import { colors } from '@/theme/tokens';

export default function CreateCardLayout() {
  return (
    <CreateCardProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </CreateCardProvider>
  );
}
