import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAllUsers } from "@/features/shared/api/generated/functions";
import { UserScreen } from "@/features/user/screens/UserScreen";

// getAllUsersをモック
vi.mock("@/features/shared/api/generated/functions", () => ({
  getAllUsers: vi.fn(),
}));

describe("UserScreen - TestC: Screen Level Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Query", () => {
    it("given: API成功 when: データ取得 + 画面レンダリング then: ユーザー一覧が表示される", async () => {
      // Given: Query APIレスポンスモック
      const mockResponse = {
        data: {
          users: [
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
          ],
        },
        status: 200,
      };
      vi.mocked(getAllUsers).mockResolvedValue(mockResponse as any);

      // When: データ取得 → 画面レンダリング
      const response = await getAllUsers();
      const users = response.data?.users || [];
      render(<UserScreen users={users} />);

      // Then: 画面にAPIデータが表示されていること
      expect(screen.getByText("taro@example.com")).toBeInTheDocument();
      expect(screen.getByText("ID: user-1")).toBeInTheDocument();
      expect(screen.getByText("hanako@example.com")).toBeInTheDocument();
      expect(screen.getByText("ID: user-2")).toBeInTheDocument();

      // Then: APIが呼ばれていること
      expect(getAllUsers).toHaveBeenCalledTimes(1);
    });

    it("given: API成功（空配列） when: データ取得 + 画面レンダリング then: 空メッセージが表示される", async () => {
      // Given: 空のレスポンス
      const mockResponse = {
        data: {
          users: [],
        },
        status: 200,
      };
      vi.mocked(getAllUsers).mockResolvedValue(mockResponse as any);

      // When: データ取得 → 画面レンダリング
      const response = await getAllUsers();
      const users = response.data?.users || [];
      render(<UserScreen users={users} />);

      // Then: 空メッセージが表示される
      expect(
        screen.getByText("ユーザーが見つかりません"),
      ).toBeInTheDocument();
    });

    it("given: API成功 when: データ取得 + 画面レンダリング then: ユーザー情報の詳細が全て表示される", async () => {
      // Given: Query APIレスポンスモック
      const mockResponse = {
        data: {
          users: [
            {
              id: "user-123",
              email: "test@example.com",
              createdAt: "2024-01-01T12:34:56.000Z",
              updatedAt: "2024-01-02T12:34:56.000Z",
            },
          ],
        },
        status: 200,
      };
      vi.mocked(getAllUsers).mockResolvedValue(mockResponse as any);

      // When: データ取得 → 画面レンダリング
      const response = await getAllUsers();
      const users = response.data?.users || [];
      render(<UserScreen users={users} />);

      // Then: 全ての情報が表示される
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("ID: user-123")).toBeInTheDocument();
      expect(screen.getByText("2024/1/1")).toBeInTheDocument();
    });
  });
});
