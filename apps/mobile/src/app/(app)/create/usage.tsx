import { router } from 'expo-router';
import { USAGE_PRESETS } from '@po/shared';
import { Button } from '@/components/Button';
import { OptionRow } from '@/components/OptionRow';
import { Screen } from '@/components/Screen';
import { StepHeader } from '@/components/StepHeader';
import { useCreateCard } from '@/features/create-card/CreateCardContext';

export default function Usage() {
  const { draft, update } = useCreateCard();
  return (
    <Screen title="Create a card" footer={<Button label="Continue" icon="arrow-forward" onPress={() => router.push('/create/duration')} />}>
      <StepHeader step={3} question="How many payments?" />
      {USAGE_PRESETS.map((preset) => (
        <OptionRow
          key={preset.label}
          title={preset.label}
          description={preset.description}
          selected={draft.maxTransactionCount === preset.maxTransactionCount}
          onPress={() => update({ maxTransactionCount: preset.maxTransactionCount })}
        />
      ))}
    </Screen>
  );
}
