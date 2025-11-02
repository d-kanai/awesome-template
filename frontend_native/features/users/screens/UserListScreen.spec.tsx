import { screen, waitFor } from "@testing-library/react-native";

import { fetcher } from "@/features/shared/api/fetcher";
import type { getAllUsersResponse } from "@/features/shared/api/generated";
import {
  cleanupMocks,
  cleanupQueryClient,
  createQueryClient,
  renderWithClient,
} from "@/features/shared/test/testsupport";
import { UserListScreen } from "@/features/users/screens/UserListScreen";

jest.mock("@/features/shared/api/fetcher", () => ({
  fetcher: jest.fn(),
}));

const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

describe("UserListScreen", () => {
  afterEach(() => {
    cleanupMocks(mockedFetcher);
  });

  it("ユーザー一覧 API のデータを表示する", async () => {
    //given API mock
    const client = createQueryClient();
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
    renderWithClient(<UserListScreen />, client);

    //then show user data
    await waitFor(() => {
      expect(screen.getByText("taro@example.com")).toBeTruthy();
    });

    cleanupQueryClient(client);
  });
});
