import { renderWithProviders } from "@/features/shared/lib/testsupport";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "../hooks/useUserList";
import { UserList } from "./UserList";

// Generated API functions をモック
vi.mock("@/features/shared/api/generated", () => ({
  useGetAllUsers: vi.fn(),
}));

const mockUsers: User[] = [
  {
    id: "1",
    email: "user1@example.com",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "user2@example.com",
    createdAt: "2025-01-02T00:00:00Z",
  },
];

describe("UserList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("given: データ読み込み中 when: コンポーネントがレンダリングされる then: ローディング状態が表示される", async () => {
    const { useGetAllUsers } = await import("@/features/shared/api/generated");

    // useGetAllUsersをモック（ローディング中）
    vi.mocked(useGetAllUsers).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<UserList />);

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("given: ユーザーデータが存在する when: データ取得成功 then: ユーザーリストが表示される", async () => {
    const { useGetAllUsers } = await import("@/features/shared/api/generated");

    // useGetAllUsersをモック（成功）
    vi.mocked(useGetAllUsers).mockReturnValue({
      data: { users: mockUsers },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<UserList />);

    // ユーザー情報が表示されることを確認（emailとID）
    await waitFor(() => {
      expect(screen.getByText("user1@example.com")).toBeInTheDocument();
      expect(screen.getByText("ID: 1")).toBeInTheDocument();
      expect(screen.getByText("user2@example.com")).toBeInTheDocument();
      expect(screen.getByText("ID: 2")).toBeInTheDocument();
    });
  });

  it("given: ユーザーデータが空 when: データ取得成功 then: 空の状態が表示される", async () => {
    const { useGetAllUsers } = await import("@/features/shared/api/generated");

    // useGetAllUsersをモック（空配列を返す）
    vi.mocked(useGetAllUsers).mockReturnValue({
      data: { users: [] },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<UserList />);

    // 空の状態メッセージを確認
    await waitFor(() => {
      expect(screen.getByText("ユーザーが見つかりません")).toBeInTheDocument();
    });
  });

  it("given: API呼び出し when: エラーが発生 then: エラーメッセージが表示される", async () => {
    const { useGetAllUsers } = await import("@/features/shared/api/generated");

    // useGetAllUsersをモック（エラーを返す）
    vi.mocked(useGetAllUsers).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("ユーザー一覧の取得に失敗しました"),
    } as any);

    renderWithProviders(<UserList />);

    // エラーメッセージを確認
    await waitFor(() => {
      expect(
        screen.getByText("ユーザー一覧の取得に失敗しました"),
      ).toBeInTheDocument();
    });
  });

  it("given: ユーザーデータが表示されている when: 日付フォーマット then: 日本語形式で表示される", async () => {
    const { useGetAllUsers } = await import("@/features/shared/api/generated");

    vi.mocked(useGetAllUsers).mockReturnValue({
      data: { users: mockUsers },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<UserList />);

    // 日付が日本語形式で表示されることを確認
    await waitFor(() => {
      expect(screen.getByText("2025/1/1")).toBeInTheDocument();
      expect(screen.getByText("2025/1/2")).toBeInTheDocument();
    });
  });
});
