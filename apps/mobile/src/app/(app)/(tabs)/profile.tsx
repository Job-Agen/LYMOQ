import { StyleSheet, Text, View } from 'react-native';
import { useMe } from '@/api/queries';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Divider, RuleRow } from '@/components/RuleRow';
import { Screen } from '@/components/Screen';
import { InfoNote, Skeleton } from '@/components/States';
import { Surface } from '@/components/Surface';
import { colors, type } from '@/theme/tokens';

const KYC_LABEL = { NOT_STARTED: 'Not started', PENDING: 'In review', VERIFIED: 'Verified', REJECTED: 'Rejected' } as const;

export default function Profile() {
  const me = useMe();
  const { signOut } = useAuth();
  const user = me.data;

  return (
    <Screen edges={['top']}>
      <Text style={type.title}>Profile</Text>
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
            <RuleRow icon="shield-checkmark-outline" label="Identity" value={KYC_LABEL[user.kycStatus]} />
            <Divider />
            <RuleRow icon="call-outline" label="Mobile number" value={user.phone ?? '—'} />
            <Divider />
            <RuleRow icon="calendar-outline" label="Member since" value={new Date(user.createdAt).toLocaleDateString()} />
          </Surface>
        </>
      )}
      <InfoNote>
        PÔ never asks for your Mobile Money PIN and never shows your full card number. If someone asks for them, it is not us.
      </InfoNote>
      <InfoNote tone="sandbox">
        Sandbox build: no real money is moved, no real card is issued and no real identity check is made.
      </InfoNote>
      <Button label="Sign out" variant="outline" icon="log-out-outline" onPress={() => void signOut()} />
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
