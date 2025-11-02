import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react-native";
import type { useRouter } from "expo-router";
import type { ReactNode } from "react";

import { AuthProvider } from "@/features/auth/context/AuthContext";
import type { fetcher } from "@/features/shared/api/fetcher";

// Type exports for mocked functions
export type MockedFetcher = jest.MockedFunction<typeof fetcher>;
export type MockedUseRouter = jest.MockedFunction<typeof useRouter>;

// Test utilities
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function renderWithClient(ui: ReactNode, client: QueryClient) {
  return render(
    <AuthProvider>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </AuthProvider>,
  );
}

// Setup router mock helper
export function setupRouterMock(
  mockedUseRouter: MockedUseRouter,
  mockPush: jest.Mock,
) {
  mockedUseRouter.mockReturnValue({
    push: mockPush,
  } as unknown as ReturnType<typeof useRouter>);
}

// Cleanup helpers
export function cleanupMocks(
  // biome-ignore lint/suspicious/noExplicitAny: Generic mock cleanup utility needs to accept any mock type
  ...mocks: Array<jest.Mock | jest.MockedFunction<any>>
) {
  for (const mock of mocks) {
    mock.mockReset();
  }
  jest.clearAllMocks();
}

export function cleanupQueryClient(client: QueryClient) {
  client.clear();
  client.getQueryCache().clear();
  client.getMutationCache().clear();
}
