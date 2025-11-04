import { screen, waitFor } from "@testing-library/react";
import { type MockedFunction, vi } from "vitest";

import { fetcher } from "@/features/shared/api/fetcher";
import type { getAllUsersResponse } from "@/features/shared/api/generated";
import { renderWithProviders } from "@/features/shared/lib/testsupport";
import { UserScreen } from "@/features/user/screens/UserScreen";

vi.mock("@/features/shared/api/fetcher", () => ({
  fetcher: vi.fn(),
}));

const mockedFetcher = fetcher as MockedFunction<typeof fetcher>;

describe("UserScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ユーザー一覧 API のデータを表示する", async () => {
    //given API mock
    const apiResponse: getAllUsersResponse = {
      data: {
        users: [
          {
            id: "user-1",
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

    //when render screen
    renderWithProviders(<UserScreen />);

    //then show user data
    await waitFor(
      () => {
        expect(screen.getByText("taro@example.com")).toBeInTheDocument();
      },
      { timeout: 10000 },
    );
  }, 15000);

  it("ユーザーが存在しない場合はメッセージを表示する", async () => {
    //given API mock with empty users
    const apiResponse: getAllUsersResponse = {
      data: {
        users: [],
      },
      status: 200,
      headers: new Headers(),
    };

    mockedFetcher.mockResolvedValueOnce(apiResponse);

    //when render screen
    renderWithProviders(<UserScreen />);

    //then show empty message
    await waitFor(
      () => {
        expect(screen.getByText("ユーザーが見つかりません")).toBeInTheDocument();
      },
      { timeout: 10000 },
    );
  }, 15000);
});
