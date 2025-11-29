import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfirmScreen } from "@/features/multi_flow/screens/ConfirmScreen";
import { useFlowStore } from "@/features/multi_flow/stores/useFlowStore";
import { createLoggerAsync } from "@/shared/lib/logger";

// Next.js router をモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Logger をモック
vi.mock("@/shared/lib/logger", () => ({
  createLoggerAsync: vi.fn(),
}));

describe("ConfirmScreen", () => {
  const mockPush = vi.fn();
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  };

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

    vi.mocked(createLoggerAsync).mockResolvedValue(mockLogger as never);
  });

  describe("正常系", () => {
    it("ストアのformDataが表示される", () => {
      // Given: ストアにデータをセット
      useFlowStore.getState().setFormData({
        name: "山田太郎",
        email: "test@example.com",
        message: "テストメッセージ",
      });

      // When: 画面レンダリング
      render(<ConfirmScreen />);

      // Then: formDataが表示される
      expect(screen.getByText("お名前")).toBeInTheDocument();
      expect(screen.getByText("山田太郎")).toBeInTheDocument();
      expect(screen.getByText("メールアドレス")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("メッセージ")).toBeInTheDocument();
      expect(screen.getByText("テストメッセージ")).toBeInTheDocument();
    });

    it("送信ボタンクリックで完了画面へ遷移する", async () => {
      const user = userEvent.setup();

      // Given: ストアにデータをセット
      useFlowStore.getState().setFormData({
        name: "山田太郎",
        email: "test@example.com",
        message: "テストメッセージ",
      });

      // When: 画面レンダリング → 送信ボタンクリック
      render(<ConfirmScreen />);
      const submitButton = screen.getByRole("button", { name: "送信する" });
      await user.click(submitButton);

      // Then: Server Actionが呼ばれる（loggerが使用される）
      await waitFor(() => {
        expect(createLoggerAsync).toHaveBeenCalled();
        expect(mockLogger.info).toHaveBeenCalled();
      });

      // Then: ストアの状態が更新される
      await waitFor(() => {
        expect(useFlowStore.getState().currentStep).toBe("complete");
      });

      // Then: 完了画面へ遷移
      expect(mockPush).toHaveBeenCalledWith("/multi_flow/complete");
    });

    it("戻るボタンクリックで入力画面へ遷移する", async () => {
      const user = userEvent.setup();

      // Given: ストアにデータをセット
      useFlowStore.getState().setFormData({
        name: "山田太郎",
        email: "test@example.com",
        message: "テストメッセージ",
      });

      // When: 画面レンダリング → 戻るボタンクリック
      render(<ConfirmScreen />);
      const backButton = screen.getByRole("button", { name: "戻る" });
      await user.click(backButton);

      // Then: 入力画面へ遷移
      expect(mockPush).toHaveBeenCalledWith("/multi_flow/input");
    });
  });

  describe("異常系", () => {
    it("formDataがnullの場合、何も表示しない", () => {
      // Given: ストアのformDataがnull（初期状態）
      expect(useFlowStore.getState().formData).toBeNull();

      // When: 画面レンダリング
      const { container } = render(<ConfirmScreen />);

      // Then: 何も表示されない
      expect(container.firstChild).toBeNull();
    });

    it("送信中は両方のボタンが無効になる", async () => {
      const user = userEvent.setup();

      // Given: createLoggerAsyncを遅延させる
      vi.mocked(createLoggerAsync).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockLogger as never), 100),
          ),
      );
      useFlowStore.getState().setFormData({
        name: "山田太郎",
        email: "test@example.com",
        message: "テストメッセージ",
      });

      // When: 画面レンダリング → 送信ボタンクリック
      render(<ConfirmScreen />);
      const submitButton = screen.getByRole("button", { name: "送信する" });
      await user.click(submitButton);

      // Then: 処理中表示に変わり、両ボタンが無効
      expect(screen.getByText("送信中...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole("button", { name: "戻る" })).toBeDisabled();
    });
  });
});
