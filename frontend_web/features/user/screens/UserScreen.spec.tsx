import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { UserListItem } from "@/features/shared/api/generated/model";
import { UserScreen } from "@/features/user/screens/UserScreen";

describe("UserScreen", () => {
  it("ユーザー一覧のデータを表示する", () => {
    //given user data
    const mockUsers: UserListItem[] = [
      {
        id: "user-1",
        email: "taro@example.com",
        createdAt: "2024-01-01T12:34:56.000Z",
        updatedAt: "2024-01-02T12:34:56.000Z",
      },
    ];

    //when render screen
    render(<UserScreen users={mockUsers} />);

    //then show user data
    expect(screen.getByText("taro@example.com")).toBeInTheDocument();
    expect(screen.getByText("ID: user-1")).toBeInTheDocument();
  });

  it("ユーザーが存在しない場合はメッセージを表示する", () => {
    //given empty users
    const mockUsers: UserListItem[] = [];

    //when render screen
    render(<UserScreen users={mockUsers} />);

    //then show empty message
    expect(screen.getByText("ユーザーが見つかりません")).toBeInTheDocument();
  });
});
