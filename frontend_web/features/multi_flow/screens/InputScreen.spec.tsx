import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { startFlow } from "@/features/multi_flow/actions/startFlow";
import { InputScreen } from "@/features/multi_flow/screens/InputScreen";
import { useFlowStore } from "@/features/multi_flow/stores/useFlowStore";

// Next.js router をモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Server Action をモック
vi.mock("@/features/multi_flow/actions/startFlow", () => ({
  startFlow: vi.fn(),
}));

describe("InputScreen", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Zustandストアをリセット
    useFlowStore.getState().reset();

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as ReturnType<typeof useRouter>);

    vi.mocked(startFlow).mockResolvedValue({ success: true });
  });

  describe("正常系", () => {
    it("初期表示で入力フィールドが表示される", () => {
      // When: 画面レンダリング
      render(<InputScreen />);

      // Then: 入力フィールドが表示される
      expect(screen.getByLabelText("お名前")).toBeInTheDocument();
      expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
      expect(screen.getByLabelText("メッセージ")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "確認画面へ" }),
      ).toBeInTheDocument();
    });

    it("全項目入力すると確認ボタンが有効になる", async () => {
      const user = userEvent.setup();

      // When: 画面レンダリング → 全項目入力
      render(<InputScreen />);

      const nameInput = screen.getByLabelText("お名前");
      const emailInput = screen.getByLabelText("メールアドレス");
      const messageInput = screen.getByLabelText("メッセージ");
      const submitButton = screen.getByRole("button", { name: "確認画面へ" });

      // Initially disabled
      expect(submitButton).toBeDisabled();

      await user.type(nameInput, "山田太郎");
      await user.type(emailInput, "test@example.com");
      await user.type(messageInput, "テストメッセージ");

      // Then: ボタンが有効になる
      expect(submitButton).toBeEnabled();
    });

    it("確認ボタンクリックでストアに保存され、確認画面へ遷移する", async () => {
      const user = userEvent.setup();

      // When: 画面レンダリング → 入力 → 確認ボタンクリック
      render(<InputScreen />);

      await user.type(screen.getByLabelText("お名前"), "山田太郎");
      await user.type(
        screen.getByLabelText("メールアドレス"),
        "test@example.com",
      );
      await user.type(screen.getByLabelText("メッセージ"), "テストメッセージ");

      const submitButton = screen.getByRole("button", { name: "確認画面へ" });
      await user.click(submitButton);

      // Then: Zustandストアに保存される
      await waitFor(() => {
        const state = useFlowStore.getState();
        expect(state.formData).toEqual({
          name: "山田太郎",
          email: "test@example.com",
          message: "テストメッセージ",
        });
        expect(state.currentStep).toBe("confirm");
      });

      // Then: Server Actionが呼ばれる
      expect(startFlow).toHaveBeenCalledTimes(1);

      // Then: 確認画面へ遷移
      expect(mockPush).toHaveBeenCalledWith("/multi_flow/confirm");
    });
  });

  describe("異常系", () => {
    it("未入力の項目がある場合、確認ボタンが無効", async () => {
      const user = userEvent.setup();

      // When: 画面レンダリング → 一部のみ入力
      render(<InputScreen />);

      await user.type(screen.getByLabelText("お名前"), "山田太郎");
      // email, messageは未入力

      // Then: ボタンが無効のまま
      const submitButton = screen.getByRole("button", { name: "確認画面へ" });
      expect(submitButton).toBeDisabled();
    });

    it("送信中は確認ボタンが無効になる", async () => {
      const user = userEvent.setup();

      // Given: startFlowを遅延させる
      vi.mocked(startFlow).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      // When: 画面レンダリング → 入力 → 確認ボタンクリック
      render(<InputScreen />);

      await user.type(screen.getByLabelText("お名前"), "山田太郎");
      await user.type(
        screen.getByLabelText("メールアドレス"),
        "test@example.com",
      );
      await user.type(screen.getByLabelText("メッセージ"), "テストメッセージ");

      const submitButton = screen.getByRole("button", { name: "確認画面へ" });
      await user.click(submitButton);

      // Then: 処理中表示に変わる
      expect(screen.getByText("処理中...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });
});
