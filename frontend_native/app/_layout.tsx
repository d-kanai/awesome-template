import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import "react-native-reanimated";

import { AuthProvider } from "@/features/auth/context/AuthContext";
import { useColorScheme } from "@/features/shared/hooks/use-color-scheme";
import { useEasUpdate } from "@/features/updates/hooks/useEasUpdate";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEasUpdate(); // EAS Updateチェック
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {},
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="users/index"
              options={{ title: "ユーザー一覧", headerBackVisible: false }}
            />
            <Stack.Screen
              name="auth/signup/index"
              options={{ title: "サインアップ" }}
            />
            <Stack.Screen
              name="auth/signin/index"
              options={{ title: "サインイン", headerBackVisible: false }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
