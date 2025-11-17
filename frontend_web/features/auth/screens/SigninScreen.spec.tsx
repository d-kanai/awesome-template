import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  vi,
} from "vitest";

import { SigninScreen } from "@/features/auth/screens/SigninScreen";
import { SigninTestIds } from "@/features/auth/test-ids";
import { fetcher } from "@/features/shared/api/fetcher";
import type { signinResponse } from "@/features/shared/api/generated/functions";
import { renderWithProviders } from "@/features/shared/lib/testsupport";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/features/shared/api/fetcher", () => ({
  fetcher: vi.fn(),
}));

const mockedFetcher = fetcher as MockedFunction<typeof fetcher>;
const mockedUseRouter = useRouter as MockedFunction<typeof useRouter>;

describe("SigninScreen - TestC", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    });
  });

  describe("正常系", () => {
    it("サインインが成功しユーザー一覧画面に遷移する", async () => {
      // Given: Command APIレスポンスモック
      const apiResponse: signinResponse = {
        data: {
          accessToken: "test-token-123",
          id: "user-1",
          email: "test@example.com",
          createdAt: "2024-01-01T12:34:56.000Z",
          updatedAt: "2024-01-02T12:34:56.000Z",
        },
        status: 200,
      };
      mockedFetcher.mockResolvedValueOnce(apiResponse);

      // When: 画面レンダリング + フォーム入力 + 送信
      renderWithProviders(<SigninScreen />);

      const emailInput = screen.getByTestId(SigninTestIds.emailInput);
      const passwordInput = screen.getByTestId(SigninTestIds.passwordInput);
      const submitButton = screen.getByTestId(SigninTestIds.submitButton);

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Then: Command APIにformのパラメータが渡り呼び出し
      await waitFor(
        () => {
          expect(mockedFetcher).toHaveBeenCalledWith(
            "/auth/signin",
            expect.objectContaining({
              method: "POST",
              body: JSON.stringify({
                email: "test@example.com",
                password: "password123",
              }),
            }),
          );
        },
        { timeout: 10000 },
      );

      // Then: URL遷移
      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith("/user");
        },
        { timeout: 10000 },
      );
    }, 15000);

    it("サインアップページへのリンクが表示される", () => {
      // Given: -

      // When: 画面レンダリング
      renderWithProviders(<SigninScreen />);

      // Then: サインアップページへのリンク存在
      const signupLink = screen.getByTestId(SigninTestIds.signupLink);
      expect(signupLink).toHaveAttribute("href", "/auth/signup");
    });
  });

  describe("異常系", () => {
    it("API認証失敗時にエラーメッセージが表示される", async () => {
      // Given: API失敗レスポンス
      mockedFetcher.mockRejectedValueOnce(
        new Error("サインインに失敗しました"),
      );

      // When: 画面レンダリング + フォーム入力 + 送信
      renderWithProviders(<SigninScreen />);

      const emailInput = screen.getByTestId(SigninTestIds.emailInput);
      const passwordInput = screen.getByTestId(SigninTestIds.passwordInput);
      const submitButton = screen.getByTestId(SigninTestIds.submitButton);

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, {
        target: { value: "wrong-password" },
      });
      fireEvent.click(submitButton);

      // Then: ユーザへのFB
      await waitFor(
        () => {
          const errorMessage = screen.getByTestId(SigninTestIds.errorMessage);
          expect(errorMessage).toHaveTextContent("サインインに失敗しました");
        },
        { timeout: 10000 },
      );

      // Then: 遷移なし
      expect(mockPush).not.toHaveBeenCalled();
    }, 15000);

    it("無効なメールアドレスでバリデーションエラーが表示される", async () => {
      // Given: -

      // When: 画面レンダリング + 無効なメール入力
      renderWithProviders(<SigninScreen />);

      const emailInput = screen.getByTestId(SigninTestIds.emailInput);
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);

      // Then: バリデーションエラーが表示される
      await waitFor(() => {
        expect(
          screen.getByText("有効なメールアドレスを入力してください"),
        ).toBeInTheDocument();
      });
    });

    it("パスワードが空でバリデーションエラーが表示される", async () => {
      // Given: -

      // When: 画面レンダリング + パスワードを空にする
      renderWithProviders(<SigninScreen />);

      const passwordInput = screen.getByTestId(SigninTestIds.passwordInput);
      fireEvent.change(passwordInput, { target: { value: "a" } });
      fireEvent.change(passwordInput, { target: { value: "" } });
      fireEvent.blur(passwordInput);

      // Then: バリデーションエラーが表示される
      await waitFor(() => {
        expect(
          screen.getByText("パスワードを入力してください"),
        ).toBeInTheDocument();
      });
    });
  });
});
