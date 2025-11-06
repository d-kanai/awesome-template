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

import { SigninScreen } from "@/features/auth/screens/SigninScreen";
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

describe("SigninScreen - TestC: Screen Level Test", () => {
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
    describe("正常系", () => {
      it("ユーザー一覧画面に遷移する", async () => {
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

        const emailInput = screen.getByLabelText("メールアドレス");
        const passwordInput = screen.getByLabelText("パスワード");
        const submitButton = screen.getByRole("button", { name: "サインイン" });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(submitButton);

        // Then: Command APIにformのパラメータが渡り呼び出されていること
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

        // Then: URL遷移が起きていること
        await waitFor(
          () => {
            expect(mockPush).toHaveBeenCalledWith("/user");
          },
          { timeout: 10000 },
        );
      }, 15000);
    });

    describe("異常系", () => {
      it("エラーメッセージが表示される", async () => {
        // Given: API失敗レスポンス
        mockedFetcher.mockRejectedValueOnce(
          new Error("サインインに失敗しました"),
        );

        // When: 画面レンダリング + フォーム入力 + 送信
        renderWithProviders(<SigninScreen />);

        const emailInput = screen.getByLabelText("メールアドレス");
        const passwordInput = screen.getByLabelText("パスワード");
        const submitButton = screen.getByRole("button", { name: "サインイン" });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, {
          target: { value: "wrong-password" },
        });
        fireEvent.click(submitButton);

        // Then: ユーザへのFBが起きていること
        await waitFor(
          () => {
            expect(
              screen.getByText("サインインに失敗しました"),
            ).toBeInTheDocument();
          },
          { timeout: 10000 },
        );

        // Then: 遷移は起きない
        expect(mockPush).not.toHaveBeenCalled();
      }, 15000);
    });
  });
});
