import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { type MockedFunction, vi } from "vitest";

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

describe("SignupScreen", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
  });

  it("フォーム送信時、正しいパラメータでサインアップAPIを呼び出し、成功後にサインイン画面に遷移する", async () => {
    const { redirect } = await import("next/navigation");

    //given API mock
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

    //when input and submit
    renderWithProviders(<SignupScreen />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインアップ" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    //then api called
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

    //then navigate to signin (Server Actionがredirectを呼ぶ)
    await waitFor(
      () => {
        expect(redirect).toHaveBeenCalledWith("/auth/signin");
      },
      { timeout: 10000 },
    );
  }, 15000);
});
