import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/tokens';

const TINTS: Record<string, string> = {
  canva: '#00C4CC',
  meta: '#0866FF',
  google: '#EA4335',
  openai: '#101815',
  netflix: '#E50914',
  amazon: '#FF9900',
};

/** Neutral letter avatar (no third-party logos are bundled). */
export function MerchantAvatar({ name, slug, size = 40 }: { name: string | null; slug?: string | null; size?: number }) {
  const tint = (slug && TINTS[slug]) || colors.green;
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 3, backgroundColor: `${tint}1F` }]}>
      {name ? (
        <Text style={[styles.letter, { color: tint, fontSize: size * 0.42 }]}>{name.charAt(0).toUpperCase()}</Text>
      ) : (
        <Ionicons name="globe-outline" size={size * 0.5} color={colors.green} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  letter: { fontWeight: '900' },
});
