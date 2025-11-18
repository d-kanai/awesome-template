import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompleteScreen } from "@/features/multi_flow/screens/CompleteScreen";
import { useFlowStore } from "@/features/multi_flow/stores/useFlowStore";

// Next.js router をモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("CompleteScreen", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Zustandストアをリセット（formDataとcurrentStepをセット）
    useFlowStore.getState().reset();
    useFlowStore.getState().setFormData({
      name: "山田太郎",
      email: "test@example.com",
      message: "テストメッセージ",
    });
    useFlowStore.getState().goToComplete();

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as ReturnType<typeof useRouter>);
  });

  describe("正常系", () => {
    it("完了メッセージが表示される", () => {
      // When: 画面レンダリング
      render(<CompleteScreen />);

      // Then: 完了メッセージが表示される
      expect(screen.getByText("送信完了")).toBeInTheDocument();
      expect(
        screen.getByText(/お問い合わせありがとうございました。/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/内容を確認の上、ご連絡させていただきます。/),
      ).toBeInTheDocument();
    });

    it("成功アイコンが表示される", () => {
      // When: 画面レンダリング
      render(<CompleteScreen />);

      // Then: 成功アイコンが表示される
      const successIcon = screen.getByRole("img", { name: "成功" });
      expect(successIcon).toBeInTheDocument();
    });

    it("マウント時にストアがリセットされる", () => {
      // Given: ストアに値がセットされている
      expect(useFlowStore.getState().formData).not.toBeNull();
      expect(useFlowStore.getState().currentStep).toBe("complete");

      // When: 画面レンダリング
      render(<CompleteScreen />);

      // Then: ストアがリセットされる
      expect(useFlowStore.getState().formData).toBeNull();
      expect(useFlowStore.getState().currentStep).toBeNull();
    });

    it("最初に戻るボタンクリックで入力画面へ遷移する", async () => {
      const user = userEvent.setup();

      // When: 画面レンダリング → 最初に戻るボタンクリック
      render(<CompleteScreen />);
      const backButton = screen.getByRole("button", { name: "最初に戻る" });
      await user.click(backButton);

      // Then: 入力画面へ遷移
      expect(mockPush).toHaveBeenCalledWith("/multi_flow/input");
    });
  });

  describe("UIコンポーネント", () => {
    it("最初に戻るボタンが表示される", () => {
      // When: 画面レンダリング
      render(<CompleteScreen />);

      // Then: ボタンが表示される
      const backButton = screen.getByRole("button", { name: "最初に戻る" });
      expect(backButton).toBeInTheDocument();
      expect(backButton).toBeEnabled();
    });
  });
});
