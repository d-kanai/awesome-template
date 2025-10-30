import { useRouter } from 'expo-router';
import { Suspense } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetAllUsers } from '@/api/generated';
import type { UserListItem } from '@/api/generated';

function UserList() {
  const router = useRouter();

  const usersQuery = useGetAllUsers({
    query: {
      select: (response) => response.data?.users ?? [],
      staleTime: 30_000,
    },
  });

  const users: (UserListItem & { createdAt?: Date; updatedAt?: Date })[] = (usersQuery.data ?? []).map(
    (user) => ({
      ...user,
      createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
    }),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ユーザー一覧</Text>
          <Text style={styles.subtitle}>登録済みのユーザーを確認できます</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            onPress={() => router.push('/users/signup')}>
            <Text style={styles.addButtonText}>+ 新規ユーザー登録</Text>
          </Pressable>
          <Pressable
            onPress={() => usersQuery.refetch()}
            style={({ pressed }) => [styles.reloadButton, pressed && styles.reloadPressed]}>
            <Text style={styles.reloadText}>再読み込み</Text>
          </Pressable>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id ?? ''}
          contentContainerStyle={users.length === 0 && styles.emptyList}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyMessage}>ユーザーがまだ登録されていません</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.userMeta}>
                作成日: {item.createdAt?.toLocaleString() ?? '不明'} / 更新日:{' '}
                {item.updatedAt?.toLocaleString() ?? '不明'}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
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

export default function UserListScreen() {
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
    backgroundColor: '#f5f5f5',
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
    fontWeight: '700',
    color: '#111',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0077cc',
    alignItems: 'center',
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reloadButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
  },
  reloadPressed: {
    opacity: 0.7,
  },
  reloadText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '600',
  },
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#555',
  },
  userCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  userEmail: {
    fontSize: 16,
    color: '#444',
  },
  userMeta: {
    fontSize: 14,
    color: '#777',
  },
  error: {
    color: '#c1121f',
    fontSize: 16,
    textAlign: 'center',
  },
  errorDetail: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#0077cc',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
});
