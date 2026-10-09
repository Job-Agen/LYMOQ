// Play Store builds: sign the release with the upload key provided at build time through
// environment variables (GitHub Actions secrets). Without them the build falls back to the
// debug key, so a missing secret can never produce an AAB that looks publishable.
const { withAppBuildGradle } = require('expo/config-plugins');

const SIGNING = `
        release {
            if (System.getenv("MESURA_UPLOAD_STORE_FILE")) {
                storeFile file(System.getenv("MESURA_UPLOAD_STORE_FILE"))
                storePassword System.getenv("MESURA_UPLOAD_STORE_PASSWORD")
                keyAlias System.getenv("MESURA_UPLOAD_KEY_ALIAS")
                keyPassword System.getenv("MESURA_UPLOAD_KEY_PASSWORD")
            }
        }`;

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let gradle = cfg.modResults.contents;
    if (gradle.includes('MESURA_UPLOAD_STORE_FILE')) return cfg;
    // Add a "release" signing config next to the generated "debug" one…
    gradle = gradle.replace(/signingConfigs\s*\{/, (m) => `${m}${SIGNING}`);
    // …and use it for release builds when the upload key is available.
    gradle = gradle.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/,
      '$1signingConfig System.getenv("MESURA_UPLOAD_STORE_FILE") ? signingConfigs.release : signingConfigs.debug',
    );
    cfg.modResults.contents = gradle;
    return cfg;
  });
};
