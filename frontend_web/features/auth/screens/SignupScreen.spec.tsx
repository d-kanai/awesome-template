import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import {
  type MockedFunction,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { SignupScreen } from "@/features/auth/screens/SignupScreen";
import { SignupTestIds } from "@/features/auth/test-ids";
import { fetcher } from "@/features/shared/api/fetcher";
import type { signupResponse } from "@/features/shared/api/generated/functions";
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

describe("SignupScreen - TestC", () => {
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
    it("サインアップが成功しサインイン画面に遷移する", async () => {
      // Given: Command APIレスポンスモック
      const apiResponse: signupResponse = {
        data: {
          id: "user-1",
          email: "test@example.com",
          createdAt: "2024-01-01T12:34:56.000Z",
          updatedAt: "2024-01-02T12:34:56.000Z",
        },
        status: 200,
      };
      mockedFetcher.mockResolvedValueOnce(apiResponse);

      // When: 画面レンダリング + フォーム入力 + 送信
      renderWithProviders(<SignupScreen />);

      const emailInput = screen.getByTestId(SignupTestIds.emailInput);
      const passwordInput = screen.getByTestId(SignupTestIds.passwordInput);
      const submitButton = screen.getByTestId(SignupTestIds.submitButton);

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Then: Command APIにformのパラメータが渡り呼び出されていること
      await waitFor(
        () => {
          expect(mockedFetcher).toHaveBeenCalledWith(
            "/auth/signup",
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

      // Then: URL遷移が起きていること
      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith("/auth/signin");
        },
        { timeout: 10000 },
      );
    }, 15000);

    it("サインインページへのリンクが表示される", () => {
      // Given: -

      // When: 画面レンダリング
      renderWithProviders(<SignupScreen />);

      // Then: サインインページへのリンクが存在する
      const signinLink = screen.getByTestId(SignupTestIds.signinLink);
      expect(signinLink).toHaveAttribute("href", "/auth/signin");
    });
  });

  describe("異常系", () => {
    it("API失敗時にエラーメッセージが表示される", async () => {
      // Given: API失敗レスポンス
      mockedFetcher.mockRejectedValueOnce(
        new Error("サインアップに失敗しました"),
      );

      // When: 画面レンダリング + フォーム入力 + 送信
      renderWithProviders(<SignupScreen />);

      const emailInput = screen.getByTestId(SignupTestIds.emailInput);
      const passwordInput = screen.getByTestId(SignupTestIds.passwordInput);
      const submitButton = screen.getByTestId(SignupTestIds.submitButton);

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Then: ユーザへのFBが起きていること
      await waitFor(
        () => {
          const errorMessage = screen.getByTestId(SignupTestIds.errorMessage);
          expect(errorMessage).toHaveTextContent("サインアップに失敗しました");
        },
        { timeout: 10000 },
      );

      // Then: 遷移は起きない
      expect(mockPush).not.toHaveBeenCalled();
    }, 15000);

    it("無効なメールアドレスでバリデーションエラーが表示される", async () => {
      // Given: -

      // When: 画面レンダリング + 無効なメール入力
      renderWithProviders(<SignupScreen />);

      const emailInput = screen.getByTestId(SignupTestIds.emailInput);
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);

      // Then: バリデーションエラーが表示される
      await waitFor(() => {
        expect(
          screen.getByText("有効なメールアドレスを入力してください"),
        ).toBeInTheDocument();
      });
    });

    it("8文字未満のパスワードでバリデーションエラーが表示される", async () => {
      // Given: -

      // When: 画面レンダリング + 短いパスワード入力
      renderWithProviders(<SignupScreen />);

      const passwordInput = screen.getByTestId(SignupTestIds.passwordInput);
      fireEvent.change(passwordInput, { target: { value: "1234567" } });
      fireEvent.blur(passwordInput);

      // Then: バリデーションエラーが表示される
      await waitFor(() => {
        expect(
          screen.getByText("パスワードは8文字以上で入力してください"),
        ).toBeInTheDocument();
      });
    });
  });
});
