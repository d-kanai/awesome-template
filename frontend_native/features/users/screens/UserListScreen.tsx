import { useRouter } from "expo-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserListItem } from "@/features/users/components/UserListItem";
import { useUserList } from "@/features/users/hooks/useUserList";

function UserList() {
  const router = useRouter();
  const { users, refetch } = useUserList();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ユーザー一覧</Text>
          <Text style={styles.subtitle}>登録済みのユーザーを確認できます</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
            onPress={() => router.push("/users/signup")}
          >
            <Text style={styles.addButtonText}>+ 新規ユーザー登録</Text>
          </Pressable>
          <Pressable
            onPress={() => refetch()}
            style={({ pressed }) => [
              styles.reloadButton,
              pressed && styles.reloadPressed,
            ]}
          >
            <Text style={styles.reloadText}>再読み込み</Text>
          </Pressable>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id ?? ""}
          contentContainerStyle={users.length === 0 && styles.emptyList}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyMessage}>
                ユーザーがまだ登録されていません
              </Text>
            </View>
          }
          renderItem={({ item }) => <UserListItem user={item} />}
        />
      </View>
    </SafeAreaView>
  );
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, styles.centered]}>
        <Text style={styles.error}>ユーザー情報を取得できませんでした</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
        <Pressable style={styles.retryButton} onPress={resetErrorBoundary}>
          <Text style={styles.retryButtonText}>再試行</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function LoadingFallback() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    </SafeAreaView>
  );
}

export function UserListScreen() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>
        <UserList />
      </Suspense>
    </ErrorBoundary>
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
    gap: 20,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#0077cc",
    alignItems: "center",
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  reloadButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#e0e7ff",
  },
  reloadPressed: {
    opacity: 0.7,
  },
  reloadText: {
    color: "#1d4ed8",
    fontSize: 14,
    fontWeight: "600",
  },
  centered: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#555",
  },
  error: {
    color: "#c1121f",
    fontSize: 16,
    textAlign: "center",
  },
  errorDetail: {
    color: "#666",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#0077cc",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
});
