import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { kycStartSchema } from '@mesura/shared';
import { errorMessage } from '@/api/client';
import { api } from '@/api/endpoints';
import { keys, useMe } from '@/api/queries';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { InfoNote, InlineError } from '@/components/States';
import { Surface } from '@/components/Surface';
import { TextField } from '@/components/TextField';
import { colors, type } from '@/theme/tokens';

type Field = 'firstName' | 'lastName' | 'dateOfBirth' | 'phone';

export default function Kyc() {
  const client = useQueryClient();
  const { signOut } = useAuth();
  const me = useMe();
  const kyc = useQuery({ queryKey: keys.kyc, queryFn: api.kyc });

  const [firstName, setFirstName] = useState(me.data?.name ?? '');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState(me.data?.phone ?? '+228 ');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const verify = useMutation({
    mutationFn: async () => {
      const parsed = kycStartSchema.safeParse({ firstName, lastName, dateOfBirth, phone, country: 'TG' });
      if (!parsed.success) {
        const next: Partial<Record<Field, string>> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as Field;
          next[key] ??= issue.message;
        }
        setErrors(next);
        return null;
      }
      setErrors({});
      await api.startKyc(parsed.data);
      return api.completeKyc();
    },
    onSuccess: async (profile) => {
      if (!profile) return;
      client.setQueryData(keys.kyc, profile);
      // When VERIFIED, refreshing /me flips the navigation guard to the app.
      await client.invalidateQueries({ queryKey: keys.me });
    },
  });

  const rejected = (verify.data ?? kyc.data)?.status === 'REJECTED';

  return (
    <Screen
      title="Verify your identity"
      back={false}
      footer={
        <>
          <Button label={rejected ? 'Try again' : 'Verify my identity'} onPress={() => verify.mutate()} loading={verify.isPending} />
          <Button label="Sign out" variant="outline" onPress={() => void signOut()} />
        </>
      }
    >
      <Text style={type.title}>One quick check before your first card</Text>
      <Text style={[type.body, { color: colors.muted }]}>
        Regulations require us to know who creates a card. It takes less than a minute.
      </Text>

      {verify.isPending ? (
        <Surface style={styles.checking}>
          <ActivityIndicator color={colors.green} />
          <Text style={type.body}>Checking your details…</Text>
        </Surface>
      ) : null}

      {rejected ? (
        <InlineError message="We couldn't verify your identity. You must be 18 or older to use Mesura." />
      ) : null}

      <TextField label="First name" value={firstName} onChangeText={setFirstName} error={errors.firstName} autoComplete="given-name" />
      <TextField label="Last name" value={lastName} onChangeText={setLastName} error={errors.lastName} autoComplete="family-name" />
      <TextField
        label="Date of birth"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        error={errors.dateOfBirth}
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      <TextField
        label="Mobile number"
        value={phone}
        onChangeText={setPhone}
        error={errors.phone}
        keyboardType="phone-pad"
        autoComplete="tel"
        hint="Togo number, e.g. +228 90 12 34 56"
      />
      <View style={styles.country}>
        <Text style={type.label}>Country</Text>
        <Text style={type.body}>🇹🇬  Togo</Text>
      </View>
      <InlineError message={verify.isError ? errorMessage(verify.error) : null} />
      <InfoNote tone="sandbox">
        Sandbox verification: no document is uploaded or stored, and no real identity check is made.
      </InfoNote>
    </Screen>
  );
}

const styles = StyleSheet.create({
  checking: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  country: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
});
