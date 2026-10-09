// Two variants of the same app, chosen at build time with APP_VARIANT:
// - sandbox (default): installable APK for testing; any API URL, plain http:// allowed, server picker on login.
// - production: Play Store build; https-only, no server picker, its own package name so both can coexist.
const PRODUCTION = process.env.APP_VARIANT === 'production';

module.exports = ({ config }) => {
  if (!PRODUCTION) return config;
  return {
    ...config,
    slug: 'mesura',
    ios: { ...config.ios, bundleIdentifier: 'africa.mesura.app' },
    android: {
      ...config.android,
      package: 'africa.mesura.app',
      // Added by default by React Native / Expo modules; Mesura needs none of them.
      blockedPermissions: [
        'android.permission.SYSTEM_ALERT_WINDOW',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
      ],
    },
    plugins: [...config.plugins.filter((p) => p !== './plugins/with-sandbox-cleartext'), './plugins/with-release-signing'],
    extra: { ...config.extra, variant: 'production' },
  };
};
