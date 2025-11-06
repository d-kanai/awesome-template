import type { UserListItem } from "@/features/shared/api/generated/model";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserList } from "./UserList";

const mockUsers: UserListItem[] = [
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
  describe("正常系", () => {
    it("ユーザーリストが表示される", () => {
      render(<UserList users={mockUsers} />);

      expect(screen.getByText("user1@example.com")).toBeInTheDocument();
      expect(screen.getByText("user2@example.com")).toBeInTheDocument();
      expect(screen.getByText("ID: 1")).toBeInTheDocument();
      expect(screen.getByText("ID: 2")).toBeInTheDocument();
    });
  });

  describe("異常系", () => {
    it("ユーザーデータが空の場合、空状態メッセージが表示される", () => {
      render(<UserList users={[]} />);

      expect(screen.getByText("ユーザーが見つかりません")).toBeInTheDocument();
    });

    it("作成日が存在しない場合、ダッシュが表示される", () => {
      const usersWithoutDate: UserListItem[] = [
        {
          id: "1",
          email: "user1@example.com",
          createdAt: undefined,
        },
      ];

      render(<UserList users={usersWithoutDate} />);

      expect(screen.getByText("-")).toBeInTheDocument();
    });
  });
});
