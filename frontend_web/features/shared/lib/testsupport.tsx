import { AuthProvider } from "@/features/shared/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";

/**
 * テスト用のQueryClientを作成
 * リトライや再フェッチを無効化して、テストの動作を予測可能にする
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Number.POSITIVE_INFINITY,
        staleTime: Number.POSITIVE_INFINITY,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * プロバイダー付きでコンポーネントをレンダリング
 * QueryClientProvider + AuthProviderでラップ
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = createQueryClient(),
    ...renderOptions
  }: RenderOptions & { queryClient?: QueryClient } = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}
