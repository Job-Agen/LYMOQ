import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { forgotPasswordSchema, resetPasswordSchema } from '@mesura/shared';
import { errorMessage } from '@/api/client';
import { api } from '@/api/endpoints';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { InfoNote, InlineError } from '@/components/States';
import { TextField } from '@/components/TextField';
import { colors, type } from '@/theme/tokens';

/** Two steps: ask for a code by e-mail, then enter it with a new password (signs in on success). */
export default function ForgotPassword() {
  const params = useLocalSearchParams<{ email?: string }>();
  const { signIn } = useAuth();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState(params.email ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const emailCheck = forgotPasswordSchema.safeParse({ email });
  const resetCheck = resetPasswordSchema.safeParse({ email, code, password });

  const sendCode = useMutation({
    mutationFn: () => api.forgotPassword({ email }),
    onSuccess: () => setStep('code'),
  });
  const reset = useMutation({
    mutationFn: () => api.resetPassword({ email, code, password }),
    onSuccess: (auth) => void signIn(auth),
  });

  if (step === 'email') {
    return (
      <Screen
        title="Mot de passe oublié"
        footer={
          <>
            <InlineError message={sendCode.isError ? errorMessage(sendCode.error) : null} />
            <Button label="Recevoir un code" icon="arrow-forward" disabled={!emailCheck.success} loading={sendCode.isPending} onPress={() => sendCode.mutate()} />
          </>
        }
      >
        <Text style={type.title}>Réinitialisez votre mot de passe</Text>
        <Text style={[type.body, { color: colors.muted }]}>
          Saisissez l'adresse e-mail de votre compte. Nous vous enverrons un code à 6 chiffres.
        </Text>
        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="vous@exemple.com"
          onSubmitEditing={() => emailCheck.success && sendCode.mutate()}
        />
      </Screen>
    );
  }

  return (
    <Screen
      title="Mot de passe oublié"
      footer={
        <>
          <InlineError message={reset.isError ? errorMessage(reset.error) : null} />
          <Button label="Changer mon mot de passe" disabled={!resetCheck.success} loading={reset.isPending} onPress={() => reset.mutate()} />
          <Button label="Renvoyer un code" variant="link" loading={sendCode.isPending} onPress={() => sendCode.mutate()} />
        </>
      }
    >
      <Text style={type.title}>Vérifiez vos e-mails</Text>
      <Text style={[type.body, { color: colors.muted }]}>
        Si un compte existe pour {email}, un code valable 15 minutes vient d'y être envoyé. Pensez à regarder dans les courriers
        indésirables.
      </Text>
      <TextField
        label="Code à 6 chiffres"
        value={code}
        onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        placeholder="123456"
        maxLength={6}
      />
      <TextField
        label="Nouveau mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        hint="Au moins 8 caractères."
      />
      <InfoNote>Mesura ne vous demandera jamais ce code par téléphone ou par message.</InfoNote>
    </Screen>
  );
}
