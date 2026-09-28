// Sandbox build only: allow plain http:// so the APK can reach a PÔ API on the
// local network (e.g. http://192.168.1.20:3000). Remove for production builds,
// which must talk to an https:// API.
const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withSandboxCleartext(config) {
  return withAndroidManifest(config, (cfg) => {
    const application = cfg.modResults.manifest.application?.[0];
    if (application) application.$['android:usesCleartextTraffic'] = 'true';
    return cfg;
  });
};
