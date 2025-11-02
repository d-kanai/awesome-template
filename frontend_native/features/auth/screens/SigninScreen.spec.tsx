import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

import { SigninScreen } from "@/features/auth/screens/SigninScreen";
import { fetcher } from "@/features/shared/api/fetcher";
import type { signinResponse } from "@/features/shared/api/generated";
import {
  cleanupMocks,
  createQueryClient,
  renderWithClient,
  setupRouterMock,
} from "@/features/shared/test/testsupport";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/features/shared/api/fetcher", () => ({
  fetcher: jest.fn(),
}));

jest.spyOn(Alert, "alert");

const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("SigninScreen", () => {
  const mockPush = jest.fn();
  let client: ReturnType<typeof createQueryClient>;

  beforeEach(() => {
    cleanupMocks(mockedFetcher, mockPush);
    setupRouterMock(mockedUseRouter, mockPush);
    client = createQueryClient();
  });

  it("フォーム送信時、正しいパラメータでサインインAPIを呼び出し、成功後にユーザー一覧画面に遷移する", async () => {
    //given API mock
    const apiResponse: signinResponse = {
      data: {
        id: "user-1",
        email: "test@example.com",
        createdAt: "2024-01-01T12:34:56.000Z",
        updatedAt: "2024-01-02T12:34:56.000Z",
      },
      status: 200,
      headers: new Headers(),
    };

    mockedFetcher.mockResolvedValueOnce(apiResponse);

    //when input and submit
    renderWithClient(<SigninScreen />, client);

    const emailInput = screen.getByTestId("signin-email");
    const passwordInput = screen.getByTestId("signin-password");
    const submitButton = screen.getByTestId("signin-submit");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(submitButton);

    //then api called
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

    //then navigate
    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith("/users");
      },
      { timeout: 10000 },
    );
  }, 15000);

  it("サインアップリンク押下時、サインアップ画面に遷移する", () => {
    //given
    renderWithClient(<SigninScreen />, client);

    //when
    const signupLink = screen.getByTestId("signin-signup-link");
    fireEvent.press(signupLink);

    //then
    expect(mockPush).toHaveBeenCalledWith("/auth/signup");
  });
});
