import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UserVoice } from "@/features/home/queries/getUserVoices";
import { HomeScreen } from "@/features/home/screens/HomeScreen";

// Next.js router をモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

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
    it("user voicesが表示される", async () => {
      // Given: テストデータ
      const userVoices: UserVoice[] = [
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
      ];

      // When: 画面レンダリング
      render(
        <HomeScreen
          userVoices={userVoices}
          featureFlagShowVersionInfo={false}
        />,
      );

      // Then: データが表示される
      expect(screen.getByText("This is amazing!")).toBeInTheDocument();
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("Highly recommended!")).toBeInTheDocument();
      expect(screen.getByText("Another User")).toBeInTheDocument();
    });

    it("Hero Sectionが表示される", async () => {
      // Given: 空のデータ
      const userVoices: UserVoice[] = [];

      // When: 画面レンダリング
      render(
        <HomeScreen
          userVoices={userVoices}
          featureFlagShowVersionInfo={false}
        />,
      );

      // Then: Hero Sectionが表示
      expect(screen.getByText("Welcome to Our Platform")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Transform your workflow with our innovative solutions",
        ),
      ).toBeInTheDocument();
    });

    it("Primary Buttonクリックで/auth/signupへ遷移する", async () => {
      // Given: 空のデータ
      const userVoices: UserVoice[] = [];
      const user = userEvent.setup();

      // When: 画面レンダリング → Primaryボタンクリック
      render(
        <HomeScreen
          userVoices={userVoices}
          featureFlagShowVersionInfo={false}
        />,
      );
      const primaryButton = screen.getByRole("button", { name: /Sign Up/i });
      await user.click(primaryButton);

      // Then: /auth/signupへ遷移
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/auth/signup");
      });
    });

    it("Secondary Buttonクリックで/contactへ遷移する", async () => {
      // Given: 空のデータ
      const userVoices: UserVoice[] = [];
      const user = userEvent.setup();

      // When: 画面レンダリング → Secondaryボタンクリック
      render(
        <HomeScreen
          userVoices={userVoices}
          featureFlagShowVersionInfo={false}
        />,
      );
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
      // Given: テストデータ
      const userVoices: UserVoice[] = [
        {
          quote: "Great product!",
          title: "Jane Doe",
          description: "Manager, Company",
          avatarSrc: "https://example.com/avatar.jpg",
        },
      ];

      // When: 画面レンダリング
      render(
        <HomeScreen
          userVoices={userVoices}
          featureFlagShowVersionInfo={false}
        />,
      );

      // Then: User Voices Sectionが表示
      expect(screen.getByText("What Our Users Say")).toBeInTheDocument();
      expect(
        screen.getByText("Trusted by teams worldwide"),
      ).toBeInTheDocument();
    });
  });

  describe("異常系", () => {
    it("user voicesが空配列の場合でもエラーにならない", async () => {
      // Given: 空のデータ
      const userVoices: UserVoice[] = [];

      // When: 画面レンダリング
      render(
        <HomeScreen
          userVoices={userVoices}
          featureFlagShowVersionInfo={false}
        />,
      );

      // Then: エラーにならず、基本構造が表示される
      expect(screen.getByText("Welcome to Our Platform")).toBeInTheDocument();
      expect(screen.getByText("What Our Users Say")).toBeInTheDocument();
    });
  });

  describe("Feature Flag", () => {
    it("showVersionInfo=trueの場合、バージョン情報が表示される", async () => {
      // Given: 空のデータ
      const userVoices: UserVoice[] = [];

      // When: showVersionInfo=trueでレンダリング
      render(
        <HomeScreen
          userVoices={userVoices}
          featureFlagShowVersionInfo={true}
        />,
      );

      // Then: バージョン情報が表示される
      expect(
        screen.getByText("Version: 1.0.0 (Feature Flag enabled)"),
      ).toBeInTheDocument();
    });

    it("showVersionInfo=falseの場合、バージョン情報が表示されない", async () => {
      // Given: 空のデータ
      const userVoices: UserVoice[] = [];

      // When: showVersionInfo=falseでレンダリング
      render(
        <HomeScreen
          userVoices={userVoices}
          featureFlagShowVersionInfo={false}
        />,
      );

      // Then: バージョン情報が表示されない
      expect(
        screen.queryByText("Version: 1.0.0 (Feature Flag enabled)"),
      ).not.toBeInTheDocument();
    });
  });
});
