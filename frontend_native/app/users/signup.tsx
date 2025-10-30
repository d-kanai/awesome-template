import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useSignup } from '@/api/generated';
import type { SignupRequest } from '@/api/generated';

const signupSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  name: z.string().min(1, '名前を入力してください'),
});

const getErrorMessage = (error: unknown) => {
  if (!error) return null;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return JSON.stringify(error);
};

type SignupValues = z.infer<typeof signupSchema>;

export default function UserSignupScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const signupMutation = useSignup({
    mutation: {
      onSuccess: (result, variables) => {
        if (result.status === 201) {
          queryClient.invalidateQueries({ queryKey: ['getAllUsers'] });
          const name = result.data.name ?? variables.data.name ?? 'ユーザー';
          Alert.alert('登録完了', `${name}さんを登録しました`, [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]);
        }
      },
    },
  });

  const form = useForm<SignupValues>({
    defaultValues: {
      email: '',
      name: '',
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value, formApi }) => {
      try {
        await signupMutation.mutateAsync({ data: value as SignupRequest });
        formApi.reset();
      } catch (err) {
        console.error(err);
      }
    },
  });

  const signupError = getErrorMessage(signupMutation.error);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ユーザー登録</Text>
          <Text style={styles.subtitle}>メールアドレスと名前を登録できます</Text>
        </View>

        <View style={styles.form}>
          <form.Field
            name="email"
            validators={{
              onChange: signupSchema.shape.email,
            }}>
            {(field) => (
              <View style={styles.field}>
                <Text style={styles.label}>メールアドレス</Text>
                <TextInput
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
                {field.state.meta.errors.length > 0 ? (
                  <Text style={styles.fieldError}>{getErrorMessage(field.state.meta.errors[0])}</Text>
                ) : null}
              </View>
            )}
          </form.Field>

          <form.Field
            name="name"
            validators={{
              onChange: signupSchema.shape.name,
            }}>
            {(field) => (
              <View style={styles.field}>
                <Text style={styles.label}>名前</Text>
                <TextInput
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="山田 太郎"
                  style={styles.input}
                />
                {field.state.meta.errors.length > 0 ? (
                  <Text style={styles.fieldError}>{getErrorMessage(field.state.meta.errors[0])}</Text>
                ) : null}
              </View>
            )}
          </form.Field>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              signupMutation.isPending ? styles.buttonDisabled : null,
              pressed ? styles.buttonPressed : null,
            ]}
            onPress={() => {
              form
                .handleSubmit()
                .catch((err) => {
                  console.error(err);
                });
            }}
            disabled={signupMutation.isPending}>
            <Text style={styles.buttonText}>
              {signupMutation.isPending ? '登録中...' : 'ユーザーを登録する'}
            </Text>
          </Pressable>

          {signupError ? <Text style={styles.mutationError}>{signupError}</Text> : null}
        </View>
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
  form: {
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
  fieldError: {
    color: '#c1121f',
    fontSize: 14,
  },
  mutationError: {
    color: '#c1121f',
    fontSize: 15,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0077cc',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
