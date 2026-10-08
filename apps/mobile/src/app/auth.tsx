import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { loginSchema, registerSchema } from '@mesura/shared';
import { errorMessage } from '@/api/client';
import { api } from '@/api/endpoints';
import { useAuth } from '@/auth/AuthProvider';
import { ApiServerSetting } from '@/components/ApiServerSetting';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { InfoNote, InlineError } from '@/components/States';
import { TextField } from '@/components/TextField';
import { colors, radius, type } from '@/theme/tokens';

type Mode = 'login' | 'signup';
type Field = 'name' | 'email' | 'password';

export default function Auth() {
  const params = useLocalSearchParams<{ mode?: Mode }>();
  const { signIn } = useAuth();
  const [mode, setMode] = useState<Mode>(params.mode === 'login' ? 'login' : 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});

  const submit = useMutation({
    mutationFn: async () => {
      if (mode === 'signup') {
        const parsed = registerSchema.safeParse({ name, email, password });
        if (!parsed.success) return collectErrors(parsed.error.issues);
        return api.register(parsed.data);
      }
      const parsed = loginSchema.safeParse({ email, password });
      if (!parsed.success) return collectErrors(parsed.error.issues);
      return api.login(parsed.data);
    },
    onSuccess: async (auth) => {
      if (auth) await signIn(auth);
    },
  });

  function collectErrors(issues: { path: (string | number)[]; message: string }[]): null {
    const next: Partial<Record<Field, string>> = {};
    for (const issue of issues) {
      const key = issue.path[0];
      if ((key === 'name' || key === 'email' || key === 'password') && !next[key]) next[key] = issue.message;
    }
    setFieldErrors(next);
    return null;
  }

  function switchMode(next: Mode) {
    setMode(next);
    setFieldErrors({});
    submit.reset();
  }

  const onSubmit = () => {
    setFieldErrors({});
    submit.mutate();
  };

  return (
    <Screen
      title={mode === 'signup' ? 'Créez votre compte' : 'Bon retour'}
      footer={
        <Button
          label={mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}
          onPress={onSubmit}
          loading={submit.isPending}
        />
      }
    >
      <View style={styles.toggle} accessibilityRole="tablist">
        {(['signup', 'login'] as const).map((m) => (
          <Pressable
            key={m}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === m }}
            onPress={() => switchMode(m)}
            style={[styles.tab, mode === m && styles.tabOn]}
          >
            <Text style={[styles.tabText, mode === m && styles.tabTextOn]}>{m === 'signup' ? 'Inscription' : 'Connexion'}</Text>
          </Pressable>
        ))}
      </View>

      {mode === 'signup' ? (
        <TextField label="Prénom" value={name} onChangeText={setName} autoComplete="given-name" error={fieldErrors.name} placeholder="Koffi" />
      ) : null}
      <TextField
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        error={fieldErrors.email}
        placeholder="vous@exemple.com"
      />
      <TextField
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        error={fieldErrors.password}
        hint={mode === 'signup' ? 'Au moins 8 caractères.' : undefined}
        onSubmitEditing={onSubmit}
      />
      <InlineError message={submit.isError ? errorMessage(submit.error) : null} />
      {mode === 'login' ? <InfoNote tone="sandbox">Compte de démo (sandbox) : demo@mesura.test / demo1234</InfoNote> : null}
      <Text style={[type.caption, { textAlign: 'center' }]}>
        Mesura sandbox · aucun argent réel, aucune vraie carte, aucune vérification d'identité réelle.
      </Text>
      <ApiServerSetting />
    </Screen>
  );
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', backgroundColor: colors.fill, borderRadius: radius.md, padding: 4 },
  tab: { flex: 1, minHeight: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  tabOn: { backgroundColor: colors.surface },
  tabText: { fontWeight: '800', color: colors.muted, fontSize: 15 },
  tabTextOn: { color: colors.forest },
});
