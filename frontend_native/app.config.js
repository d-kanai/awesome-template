// EASビルド環境、またはGitHub Actionsなどの真のCI環境でのみexpo-dev-clientを有効化
const IS_EAS_BUILD = process.env.EAS_BUILD === "true";
const IS_GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === "true";
const ENABLE_DEV_CLIENT = IS_EAS_BUILD || IS_GITHUB_ACTIONS;

module.exports = ({ config }) => {
  // app.jsonの設定をベースにする
  const appConfig = { ...config };

  // CI環境（EASビルドまたはGitHub Actions）でのみexpo-dev-clientプラグインを追加
  if (ENABLE_DEV_CLIENT) {
    appConfig.plugins = [...(appConfig.plugins || []), "expo-dev-client"];
    console.log("✅ expo-dev-client plugin added for CI/EAS build");
  } else {
    console.log("ℹ️  expo-dev-client plugin skipped for local development");
  }

  return appConfig;
};
