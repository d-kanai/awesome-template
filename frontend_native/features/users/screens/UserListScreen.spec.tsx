import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { fetcher } from "@/features/shared/api/fetcher";
import type { getAllUsersResponse } from "@/features/shared/api/generated";
import { UserListScreen } from "@/features/users/screens/UserListScreen";

jest.mock("@/features/shared/api/fetcher", () => ({
  fetcher: jest.fn(),
}));

const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function renderWithClient(ui: ReactNode, client: QueryClient) {
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe("UserListScreen", () => {
  afterEach(() => {
    mockedFetcher.mockReset();
  });

  it("ユーザー一覧 API のデータを表示する", async () => {
    const client = createQueryClient();
    const apiResponse: getAllUsersResponse = {
      data: {
        users: [
          {
            id: "user-1",
            name: "山田 太郎",
            email: "taro@example.com",
            createdAt: "2024-01-01T12:34:56.000Z",
            updatedAt: "2024-01-02T12:34:56.000Z",
          },
        ],
      },
      status: 200,
      headers: new Headers(),
    };

    mockedFetcher.mockResolvedValueOnce(apiResponse);

    renderWithClient(<UserListScreen />, client);

    await waitFor(() => {
      expect(screen.getByText("山田 太郎")).toBeTruthy();
      expect(screen.getByText("taro@example.com")).toBeTruthy();
    });

    client.clear();
    client.getQueryCache().clear();
  });
});
