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

describe("SignupScreen - TestC: Screen Level Test", () => {
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

  describe("Command", () => {
    it("given: - when: 有効なフォームデータ送信 then: APIが呼ばれ、サインイン画面に遷移する", async () => {
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

      const emailInput = screen.getByLabelText("メールアドレス");
      const passwordInput = screen.getByLabelText("パスワード");
      const submitButton = screen.getByRole("button", { name: "サインアップ" });

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

    it("given: - when: API失敗 then: エラーメッセージが表示される", async () => {
      // Given: API失敗レスポンス
      mockedFetcher.mockRejectedValueOnce(
        new Error("サインアップに失敗しました"),
      );

      // When: 画面レンダリング + フォーム入力 + 送信
      renderWithProviders(<SignupScreen />);

      const emailInput = screen.getByLabelText("メールアドレス");
      const passwordInput = screen.getByLabelText("パスワード");
      const submitButton = screen.getByRole("button", { name: "サインアップ" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Then: ユーザへのFBが起きていること
      await waitFor(
        () => {
          expect(
            screen.getByText("サインアップに失敗しました"),
          ).toBeInTheDocument();
        },
        { timeout: 10000 },
      );

      // Then: 遷移は起きない
      expect(mockPush).not.toHaveBeenCalled();
    }, 15000);
  });
});
