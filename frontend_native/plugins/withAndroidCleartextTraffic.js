const { withAndroidManifest, AndroidConfig } = require("@expo/config-plugins");

/**
 * Config plugin to enable cleartext HTTP traffic on Android
 * @param {import('@expo/config-plugins').ExportedConfig} config
 * @returns {import('@expo/config-plugins').ExportedConfig}
 */
const withAndroidCleartextTraffic = (config) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const mainApplication =
      AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);

    // Add usesCleartextTraffic attribute
    mainApplication.$["android:usesCleartextTraffic"] = "true";

    return config;
  });
};

module.exports = withAndroidCleartextTraffic;
