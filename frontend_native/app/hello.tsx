import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';

import { USERS_ENDPOINT } from '@/constants/api';

const nameSchema = z.string().min(1, '名前を入力してください');

// Expo のデバイスで利用される API エンドポイントをデバッグ用に表示
console.log('USERS_ENDPOINT', USERS_ENDPOINT);

const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const usersResponseSchema = z.object({
  users: z.array(userSchema),
});

type User = z.infer<typeof userSchema>;

type FormValues = {
  name: string;
};

export default function HelloScreen() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch(USERS_ENDPOINT);
      if (!response.ok) {
        throw new Error(`ユーザー一覧の取得に失敗しました (HTTP ${response.status})`);
      }

      const json = await response.json();
      const parsed = usersResponseSchema.parse(json);
      return parsed.users;
    },
    staleTime: 30_000,
  });

  const form = useForm<FormValues>({
    defaultValues: { name: '' },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      Alert.alert('こんにちは', `${value.name}さん、ようこそ 👋`);
    },
  });

  const greeting = useMemo(() => {
    if (isLoading) {
      return 'Loading users...';
    }
    if (isError) {
      return 'Failed to load users';
    }
    return 'Hello World!';
  }, [isError, isLoading]);

  const errorMessage = isError
    ? ((error as Error | undefined)?.message ?? 'ユーザー情報を取得できませんでした')
    : null;

  const users = data ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{greeting}</Text>
        <Text style={styles.subtitle}>Expo × TanStack Query × TanStack Form × Zod</Text>
        <form.Field
          name="name"
          validators={{
            onChange: nameSchema,
          }}>
          {(field) => (
            <View style={styles.field}>
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="お名前を入力"
                style={styles.input}
              />
              {field.state.meta.errors.length > 0 ? (
                <Text style={styles.formError}>{field.state.meta.errors[0]}</Text>
              ) : null}
            </View>
          )}
        </form.Field>
        <Button title="挨拶する" onPress={form.handleSubmit()} />
        <View style={styles.divider} />
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>登録済みユーザー</Text>
          <Button title="再読み込み" onPress={() => refetch()} />
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : isError ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            contentContainerStyle={users.length === 0 && styles.emptyList}
            ListEmptyComponent={
              <Text style={styles.emptyMessage}>ユーザーがまだ登録されていません</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userMeta}>
                  作成日: {item.createdAt.toLocaleString()}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
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
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
  field: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  formError: {
    color: '#c1121f',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
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
  },
});
