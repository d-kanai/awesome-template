import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

import { SignupScreen } from "@/features/auth/screens/SignupScreen";
import { fetcher } from "@/features/shared/api/fetcher";
import type { signupResponse } from "@/features/shared/api/generated";
import {
  cleanupMocks,
  cleanupQueryClient,
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

describe("SignupScreen", () => {
  const mockPush = jest.fn();
  let client: ReturnType<typeof createQueryClient>;

  beforeEach(() => {
    cleanupMocks(mockedFetcher, mockPush);
    setupRouterMock(mockedUseRouter, mockPush);
    client = createQueryClient();
  });

  it("フォーム送信時、正しいパラメータでサインアップAPIを呼び出し、成功後にホーム画面に遷移する", async () => {
    //given API mock
    const apiResponse: signupResponse = {
      data: {
        id: "user-1",
        email: "test@example.com",
        createdAt: "2024-01-01T12:34:56.000Z",
        updatedAt: "2024-01-02T12:34:56.000Z",
      },
      status: 201,
      headers: new Headers(),
    };

    mockedFetcher.mockResolvedValueOnce(apiResponse);

    //when input and submit
    renderWithClient(<SignupScreen />, client);

    const emailInput = screen.getByTestId("signup-email");
    const passwordInput = screen.getByTestId("signup-password");
    const submitButton = screen.getByTestId("signup-submit");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(submitButton);

    //then api called
    await waitFor(() => {
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
    });

    //then show popup
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Success",
        "Account created for test@example.com",
        expect.any(Array),
      );
    });

    const alertCalls = (Alert.alert as jest.Mock).mock.calls;
    const lastCall = alertCalls[alertCalls.length - 1];
    const okButton = lastCall[2][0];
    okButton.onPress();

    //then navigate
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
