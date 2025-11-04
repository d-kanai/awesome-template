import { renderWithProviders } from "@/features/shared/lib/testsupport";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignupForm } from "./SignupForm";

// fetcher関数をモック
vi.mock("@/features/shared/api/fetcher", () => ({
  fetcher: vi.fn(),
}));

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("given: SignupFormが表示される when: コンポーネントがレンダリングされる then: すべてのフィールドが表示される", () => {
    renderWithProviders(<SignupForm />);

    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "サインアップ" }),
    ).toBeInTheDocument();
  });

  it("given: 空のフォーム when: メールアドレスが無効 then: バリデーションエラーが表示される", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />);

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

  it("given: 空のフォーム when: パスワードが短い then: バリデーションエラーが表示される", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />);

    const passwordInput = screen.getByLabelText("パスワード");

    // 短いパスワードを入力
    await user.type(passwordInput, "1234567");
    await user.tab();

    // バリデーションエラーを確認
    await waitFor(() => {
      expect(
        screen.getByText("パスワードは8文字以上で入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("given: 有効なフォームデータ when: サインアップボタンをクリック then: 送信中の状態が表示される", async () => {
    const user = userEvent.setup();
    const { fetcher } = await import("@/features/shared/api/fetcher");

    // fetcherをモック（遅延させる）
    vi.mocked(fetcher).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    );

    renderWithProviders(<SignupForm />);

    // フォームに入力
    await user.type(
      screen.getByLabelText("メールアドレス"),
      "test@example.com",
    );
    await user.type(screen.getByLabelText("パスワード"), "password123");

    // 送信
    await user.click(screen.getByRole("button", { name: "サインアップ" }));

    // 送信中の状態を確認
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "登録中..." }),
      ).toBeInTheDocument();
    });
  });

  it("given: サインアップフォーム when: リンクをクリック then: サインインページへのリンクが機能する", () => {
    renderWithProviders(<SignupForm />);

    const signinLink = screen.getByRole("link", { name: "サインイン" });
    expect(signinLink).toHaveAttribute("href", "/auth/signin");
  });
});
