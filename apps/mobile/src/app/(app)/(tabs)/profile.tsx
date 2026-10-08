import { StyleSheet, Text, View } from 'react-native';
import { useMe } from '@/api/queries';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Divider, RuleRow } from '@/components/RuleRow';
import { Screen } from '@/components/Screen';
import { InfoNote, Skeleton } from '@/components/States';
import { Surface } from '@/components/Surface';
import { formatDate } from '@/lib/format';
import { colors, type } from '@/theme/tokens';

const KYC_LABEL = { NOT_STARTED: 'Non commencée', PENDING: 'En cours', VERIFIED: 'Vérifiée', REJECTED: 'Refusée' } as const;

export default function Profile() {
  const me = useMe();
  const { signOut } = useAuth();
  const user = me.data;

  return (
    <Screen edges={['top']}>
      <Text style={type.title}>Profil</Text>
      {!user ? (
        <Skeleton height={180} />
      ) : (
        <>
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.initial}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={type.heading}>{user.name}</Text>
              <Text style={type.caption}>{user.email}</Text>
            </View>
          </View>
          <Surface>
            <RuleRow icon="shield-checkmark-outline" label="Identité" value={KYC_LABEL[user.kycStatus]} />
            <Divider />
            <RuleRow icon="call-outline" label="Numéro de mobile" value={user.phone ?? '—'} />
            <Divider />
            <RuleRow icon="calendar-outline" label="Membre depuis" value={formatDate(user.createdAt)} />
          </Surface>
        </>
      )}
      <InfoNote>
        Mesura ne vous demande jamais votre code PIN Mobile Money et n'affiche jamais le numéro complet de votre carte. Si quelqu'un vous les demande, ce n'est pas nous.
      </InfoNote>
      <InfoNote tone="sandbox">
        Version sandbox : aucun argent réel ne circule, aucune vraie carte n'est émise et aucune vraie vérification d'identité n'est faite.
      </InfoNote>
      <Button label="Se déconnecter" variant="outline" icon="log-out-outline" onPress={() => void signOut()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: colors.onDark, fontSize: 24, fontWeight: '900' },
});
