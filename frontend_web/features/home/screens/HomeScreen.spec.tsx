import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getUserVoices } from "@/features/home/queries/getUserVoices";
import { HomeScreen } from "@/features/home/screens/HomeScreen";

// 本番API関数をモック（Screen Testは本実装に対してテスト）
vi.mock("@/shared/api/generated/functions", () => ({
  getUserVoices: vi.fn(),
}));

// Next.js router をモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const { getUserVoices: getUserVoicesAPI } = await import(
  "@/shared/api/generated/functions"
);

describe("HomeScreen - TestC", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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
    it("APIから取得したuser voicesが表示される", async () => {
      // Given: API レスポンスモック
      const mockResponse = {
        data: {
          userVoices: [
            {
              quote: "This is amazing!",
              title: "Test User",
              description: "CEO, Test Company",
              avatarSrc: "https://example.com/avatar.jpg",
            },
            {
              quote: "Highly recommended!",
              title: "Another User",
              description: "CTO, Another Company",
              avatarSrc: "https://example.com/avatar2.jpg",
            },
          ],
        },
        status: 200,
      };
      vi.mocked(getUserVoicesAPI).mockResolvedValue(mockResponse);

      // When: データ取得 → 画面レンダリング
      const userVoices = await getUserVoices();
      render(<HomeScreen userVoices={userVoices} />);

      // Then: モックデータが表示される
      expect(screen.getByText("This is amazing!")).toBeInTheDocument();
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("Highly recommended!")).toBeInTheDocument();
      expect(screen.getByText("Another User")).toBeInTheDocument();
    });

    it("Hero Sectionが表示される", async () => {
      // Given: API レスポンスモック
      const mockResponse = {
        data: { userVoices: [] },
        status: 200,
      };
      vi.mocked(getUserVoicesAPI).mockResolvedValue(mockResponse);

      // When: データ取得 → 画面レンダリング
      const userVoices = await getUserVoices();
      render(<HomeScreen userVoices={userVoices} />);

      // Then: Hero Sectionが表示
      expect(screen.getByText("Welcome to Our Platform")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Transform your workflow with our innovative solutions",
        ),
      ).toBeInTheDocument();
    });

    it("Primary Buttonクリックで/auth/signupへ遷移する", async () => {
      // Given: API レスポンスモック
      const mockResponse = {
        data: { userVoices: [] },
        status: 200,
      };
      vi.mocked(getUserVoicesAPI).mockResolvedValue(mockResponse);
      const user = userEvent.setup();

      // When: データ取得 → 画面レンダリング → Primaryボタンクリック
      const userVoices = await getUserVoices();
      render(<HomeScreen userVoices={userVoices} />);
      const primaryButton = screen.getByRole("button", { name: /Sign Up/i });
      await user.click(primaryButton);

      // Then: /auth/signupへ遷移
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/auth/signup");
      });
    });

    it("Secondary Buttonクリックで/contactへ遷移する", async () => {
      // Given: API レスポンスモック
      const mockResponse = {
        data: { userVoices: [] },
        status: 200,
      };
      vi.mocked(getUserVoicesAPI).mockResolvedValue(mockResponse);
      const user = userEvent.setup();

      // When: データ取得 → 画面レンダリング → Secondaryボタンクリック
      const userVoices = await getUserVoices();
      render(<HomeScreen userVoices={userVoices} />);
      const secondaryButton = screen.getByRole("button", {
        name: /Contact Us/i,
      });
      await user.click(secondaryButton);

      // Then: /contactへ遷移
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/contact");
      });
    });

    it("User Voices Sectionが表示される", async () => {
      // Given: API レスポンスモック
      const mockResponse = {
        data: {
          userVoices: [
            {
              quote: "Great product!",
              title: "Jane Doe",
              description: "Manager, Company",
              avatarSrc: "https://example.com/avatar.jpg",
            },
          ],
        },
        status: 200,
      };
      vi.mocked(getUserVoicesAPI).mockResolvedValue(mockResponse);

      // When: データ取得 → 画面レンダリング
      const userVoices = await getUserVoices();
      render(<HomeScreen userVoices={userVoices} />);

      // Then: User Voices Sectionが表示
      expect(screen.getByText("What Our Users Say")).toBeInTheDocument();
      expect(
        screen.getByText("Trusted by teams worldwide"),
      ).toBeInTheDocument();
    });
  });

  describe("異常系", () => {
    it("user voicesが空配列の場合でもエラーにならない", async () => {
      // Given: 空のAPI レスポンスモック
      const mockResponse = {
        data: { userVoices: [] },
        status: 200,
      };
      vi.mocked(getUserVoicesAPI).mockResolvedValue(mockResponse);

      // When: データ取得 → 画面レンダリング
      const userVoices = await getUserVoices();
      render(<HomeScreen userVoices={userVoices} />);

      // Then: エラーにならず、基本構造が表示される
      expect(screen.getByText("Welcome to Our Platform")).toBeInTheDocument();
      expect(screen.getByText("What Our Users Say")).toBeInTheDocument();
    });
  });
});
