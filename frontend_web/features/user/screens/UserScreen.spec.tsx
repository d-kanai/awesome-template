import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserTestIds } from "@/features/user/ids";
import { getAllUsers } from "@/features/user/queries/getAllUsers";
import { UserScreen } from "@/features/user/screens/UserScreen";
import { getAllUsers as getAllUsersApi } from "@/shared/api/generated/functions";

vi.mock("@/shared/api/generated/functions", () => ({
  getAllUsers: vi.fn(),
}));

describe("UserScreen - TestC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("正常系", () => {
    it("ユーザー一覧が表示される", async () => {
      // Given: Query APIレスポンスモック
      const mockUsers = [
        {
          id: "user-1",
          email: "taro@example.com",
          createdAt: "2024-01-01T12:34:56.000Z",
          updatedAt: "2024-01-02T12:34:56.000Z",
        },
        {
          id: "user-2",
          email: "hanako@example.com",
          createdAt: "2024-01-03T12:34:56.000Z",
          updatedAt: "2024-01-04T12:34:56.000Z",
        },
      ];
      vi.mocked(getAllUsersApi).mockResolvedValue({
        data: { users: mockUsers },
        status: 200,
      });

      // When: データ取得 → 画面レンダリング
      const users = await getAllUsers();
      render(<UserScreen users={users} />);

      // Then: 画面にAPIデータ表示
      const userEmails = screen.getAllByTestId(UserTestIds.userEmail);
      expect(userEmails[0]).toHaveTextContent("taro@example.com");
      expect(userEmails[1]).toHaveTextContent("hanako@example.com");

      const userIds = screen.getAllByTestId(UserTestIds.userId);
      expect(userIds[0]).toHaveTextContent("user-1");
      expect(userIds[1]).toHaveTextContent("user-2");

      const createdAts = screen.getAllByTestId(UserTestIds.userCreatedAt);
      expect(createdAts[0]).toHaveTextContent("2024年1月1日");
      expect(createdAts[1]).toHaveTextContent("2024年1月3日");

      // Then: API呼び出し
      expect(getAllUsersApi).toHaveBeenCalledTimes(1);
    });
  });

  describe("異常系", () => {
    it("ユーザーが0件の場合に空メッセージが表示される", async () => {
      // Given: 空のレスポンス
      vi.mocked(getAllUsersApi).mockResolvedValue({
        data: { users: [] },
        status: 200,
      });

      // When: データ取得 → 画面レンダリング
      const users = await getAllUsers();
      render(<UserScreen users={users} />);

      // Then: 空メッセージが表示される
      const emptyMessage = screen.getByTestId(UserTestIds.emptyMessage);
      expect(emptyMessage).toHaveTextContent("ユーザーが見つかりません");
    });
  });
});
