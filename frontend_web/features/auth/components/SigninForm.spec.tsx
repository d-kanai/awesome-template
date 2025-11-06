import { renderWithProviders } from "@/features/shared/lib/testsupport";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SigninForm } from "./SigninForm";

// fetcher関数をモック
vi.mock("@/features/shared/api/fetcher", () => ({
  fetcher: vi.fn(),
}));

// next/navigationのredirectとuseRouterをモック
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
}));

describe("SigninForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("given: SigninFormが表示される when: コンポーネントがレンダリングされる then: すべてのフィールドが表示される", () => {
    renderWithProviders(<SigninForm />);

    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "サインイン" }),
    ).toBeInTheDocument();
  });

  it("given: 空のフォーム when: メールアドレスが無効 then: バリデーションエラーが表示される", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SigninForm />);

    const emailInput = screen.getByLabelText("メールアドレス");

    // 無効なメールアドレスを入力
    await user.type(emailInput, "invalid-email");
    await user.tab();

    // バリデーションエラーを確認
    await waitFor(() => {
      expect(
        screen.getByText("有効なメールアドレスを入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("given: 空のフォーム when: パスワードが空 then: バリデーションエラーが表示される", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SigninForm />);

    const passwordInput = screen.getByLabelText("パスワード");

    // パスワードを入力して削除
    await user.type(passwordInput, "a");
    await user.clear(passwordInput);
    await user.tab();

    // バリデーションエラーを確認
    await waitFor(() => {
      expect(
        screen.getByText("パスワードを入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("given: サインインフォーム when: リンクをクリック then: サインアップページへのリンクが機能する", () => {
    renderWithProviders(<SigninForm />);

    const signupLink = screen.getByRole("link", { name: "サインアップ" });
    expect(signupLink).toHaveAttribute("href", "/auth/signup");
  });

  it("given: サインインエラー when: APIがエラーを返す then: エラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    const { fetcher } = await import("@/features/shared/api/fetcher");

    // fetcherをモック（エラーを返す）
    vi.mocked(fetcher).mockRejectedValue(new Error("認証に失敗しました"));

    renderWithProviders(<SigninForm />);

    // フォームに入力
    await user.type(
      screen.getByLabelText("メールアドレス"),
      "test@example.com",
    );
    await user.type(screen.getByLabelText("パスワード"), "password123");

    // 送信
    await user.click(screen.getByRole("button", { name: "サインイン" }));

    // エラーメッセージを確認
    await waitFor(() => {
      expect(screen.getByText("認証に失敗しました")).toBeInTheDocument();
    });
  });
});
