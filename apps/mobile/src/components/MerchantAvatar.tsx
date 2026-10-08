import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/tokens';

/** Brand-coloured tiles with a white initial (no third-party logos are bundled). */
const TINTS: Record<string, { bg: string; fg: string }> = {
  canva: { bg: '#3B82F6', fg: '#FFFFFF' },
  meta: { bg: '#EAF1FF', fg: '#0866FF' },
  google: { bg: '#FFFFFF', fg: '#EA4335' },
  openai: { bg: '#101815', fg: '#FFFFFF' },
  netflix: { bg: '#141414', fg: '#E50914' },
  amazon: { bg: '#F5A623', fg: '#141414' },
};

/** Neutral letter avatar (no third-party logos are bundled). */
export function MerchantAvatar({ name, slug, size = 40 }: { name: string | null; slug?: string | null; size?: number }) {
  const tint = (slug && TINTS[slug]) || { bg: colors.green, fg: colors.onDark };
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 3.2, backgroundColor: name ? tint.bg : colors.mint },
        name && tint.bg === '#FFFFFF' ? styles.outlined : null,
      ]}
    >
      {name ? (
        <Text style={[styles.letter, { color: tint.fg, fontSize: size * 0.46 }]}>{name.charAt(0).toUpperCase()}</Text>
      ) : (
        <Ionicons name="globe-outline" size={size * 0.5} color={colors.green} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  outlined: { borderWidth: 1, borderColor: colors.border },
  letter: { fontWeight: '900' },
});
