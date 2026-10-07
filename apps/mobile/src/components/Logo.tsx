import { Image } from 'react-native';

// Rendered from brand/mesura-logo*.svg (see brand/README.md). Width/height ratio of the lockup.
const LOGO_RATIO = 576 / 120;
const WORDMARK_RATIO = 282 / 84;

const SOURCES = {
  logo: { onLight: require('../../assets/brand/logo.png'), onDark: require('../../assets/brand/logo-white.png') },
  wordmark: { onDark: require('../../assets/brand/wordmark-white.png') },
} as const;

interface LogoProps {
  height?: number;
  /** Background the logo sits on. */
  on?: 'light' | 'dark';
}

/** Mesura lockup: symbol + wordmark. */
export function Logo({ height = 32, on = 'light' }: LogoProps) {
  return (
    <Image
      source={on === 'light' ? SOURCES.logo.onLight : SOURCES.logo.onDark}
      style={{ height, width: height * LOGO_RATIO }}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="Mesura"
    />
  );
}

/** Wordmark only, for dark surfaces such as the virtual card. */
export function Wordmark({ height = 22 }: { height?: number }) {
  return (
    <Image
      source={SOURCES.wordmark.onDark}
      style={{ height, width: height * WORDMARK_RATIO }}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="Mesura"
    />
  );
}
