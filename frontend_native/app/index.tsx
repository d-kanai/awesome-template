import { Link } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Awesome Template</Text>
        <Text style={styles.subtitle}>Expo Router × TanStack × Zod</Text>
        <Link href="/hello" asChild>
          <Pressable style={styles.link}>
            <Text style={styles.linkText}>Hello World を開く →</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f5f5f5',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#b3b3b3',
    textAlign: 'center',
  },
  link: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: '#4f46e5',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
