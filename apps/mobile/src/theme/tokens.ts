/** Mesura design tokens — dark forest green on a light, slightly green-tinted white. */
export const colors = {
  forest: '#073D31',
  forestDeep: '#04291F',
  green: '#005C47',
  accent: '#0AA17F',
  mint: '#E3F2EA',
  bg: '#F5F7F5',
  surface: '#FFFFFF',
  text: '#101815',
  muted: '#66736D',
  border: '#E3E8E4',
  danger: '#B42318',
  dangerSoft: '#FDECEA',
  warning: '#9A6700',
  warningSoft: '#FFF4D6',
  info: '#1F4E79',
  infoSoft: '#E6EEF7',
  onDark: '#FFFFFF',
  onDarkMuted: 'rgba(255,255,255,0.72)',
  /** Neutral fills: secondary chips, segmented controls, skeletons. */
  fill: '#EDF0EE',
  success: '#12A150',
} as const;

export const radius = { sm: 10, md: 14, lg: 20, pill: 999 } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const type = {
  display: { fontSize: 32, fontWeight: '800', letterSpacing: -0.8, color: colors.text },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, color: colors.text },
  heading: { fontSize: 17, fontWeight: '800', color: colors.text },
  body: { fontSize: 15, fontWeight: '500', color: colors.text },
  label: { fontSize: 13, fontWeight: '700', color: colors.muted },
  caption: { fontSize: 12, fontWeight: '500', color: colors.muted },
} as const;

/** Minimum touch target height. */
export const TOUCH = 52;
