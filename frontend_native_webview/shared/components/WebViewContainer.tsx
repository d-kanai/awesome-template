import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { env } from "../lib/env";

export function WebViewContainer() {
  return (
    <WebView
      source={{ uri: env.EXPO_PUBLIC_WEBVIEW_URL }}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
