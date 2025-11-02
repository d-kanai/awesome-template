import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Choose an option to continue</Text>
        </View>

        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed ? styles.buttonPressed : null,
            ]}
            testID="home-signin-button"
            onPress={() => router.push("/auth/signin")}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed ? styles.buttonPressed : null,
            ]}
            testID="home-signup-button"
            onPress={() => router.push("/auth/signup")}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Sign Up
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.tertiaryButton,
              pressed ? styles.buttonPressed : null,
            ]}
            testID="home-browse-users-button"
            onPress={() => router.push("/users")}
          >
            <Text style={[styles.buttonText, styles.tertiaryButtonText]}>
              Browse Users
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 32,
    justifyContent: "center",
  },
  header: {
    gap: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  buttons: {
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#0077cc",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#0077cc",
  },
  tertiaryButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#0077cc",
  },
  tertiaryButtonText: {
    color: "#333",
  },
});
