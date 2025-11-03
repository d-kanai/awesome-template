import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { StyleSheet, Text, View } from "react-native";

export function VersionInfo() {
  const appVersion = Constants.expoConfig?.version ?? "Unknown";
  const nativeBuildVersion = Constants.nativeBuildVersion ?? "Unknown";
  const updateId = Updates.updateId ?? "None";
  const runtimeVersion = Updates.runtimeVersion ?? "Unknown";
  const channel = Updates.channel ?? "Unknown";

  // updateIdは長いので短縮表示
  const shortUpdateId =
    updateId === "None" ? "None" : `${updateId.substring(0, 8)}...`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>バージョン情報</Text>

      <View style={styles.row}>
        <Text style={styles.label}>App Version:</Text>
        <Text style={styles.value}>{appVersion}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Native Build:</Text>
        <Text style={styles.value}>{nativeBuildVersion}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Update ID:</Text>
        <Text style={styles.value}>{shortUpdateId}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Runtime Version:</Text>
        <Text style={styles.value}>{runtimeVersion}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Channel:</Text>
        <Text style={styles.value}>{channel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});
