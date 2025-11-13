import { getTestimonials } from "@/features/home/queries/getTestimonials";
import { getTestimonials as getTestimonialsAPI } from "@/features/shared/api/generated/tmp-functions";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeTestIds } from "../test-ids";
import { HomeScreen } from "./HomeScreen";

// Orval生成API関数をモック
vi.mock("@/features/shared/api/generated/tmp-functions", () => ({
  getTestimonials: vi.fn(),
}));

describe("HomeScreen - TestC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("正常系", () => {
    it("ホーム画面が正しく表示される", async () => {
      // Given: API レスポンスモック
      const mockResponse = {
        data: {
          testimonials: [
            {
              quote: "Test quote",
              title: "Test User",
              description: "Test Role",
              avatarSrc: "https://example.com/avatar.jpg",
            },
          ],
        },
        status: 200,
      };
      vi.mocked(getTestimonialsAPI).mockResolvedValue(mockResponse);

      // When: データ取得 → 画面レンダリング
      const testimonials = await getTestimonials();
      render(<HomeScreen testimonials={testimonials} />);

      // Then: 画面にコンテンツが表示される
      // プレースホルダー画像が表示される
      const placeholderImage = screen.getByTestId(HomeTestIds.placeholderImage);
      expect(placeholderImage).toBeInTheDocument();

      // Then: API呼び出し
      expect(getTestimonialsAPI).toHaveBeenCalledTimes(1);
    });

    it("testimonials が正しく表示される", async () => {
      // Given: API レスポンスモック
      const mockResponse = {
        data: {
          testimonials: [
            {
              quote:
                "This product has completely transformed how we work. Highly recommended!",
              title: "Sarah Johnson",
              description: "CEO, TechCorp",
              avatarSrc: "https://i.pravatar.cc/150?img=1",
            },
            {
              quote:
                "The best investment we've made for our business this year.",
              title: "Michael Chen",
              description: "Product Manager, StartupXYZ",
              avatarSrc: "https://i.pravatar.cc/150?img=2",
            },
            {
              quote:
                "Outstanding service and support. The team really cares about their customers.",
              title: "Emma Wilson",
              description: "Designer, Creative Agency",
              avatarSrc: "https://i.pravatar.cc/150?img=3",
            },
          ],
        },
        status: 200,
      };
      vi.mocked(getTestimonialsAPI).mockResolvedValue(mockResponse);

      // When: データ取得 → 画面レンダリング
      const testimonials = await getTestimonials();
      render(<HomeScreen testimonials={testimonials} />);

      // Then: testimonialsの内容が表示される（モックデータをアサート）
      expect(
        screen.getByText(
          "This product has completely transformed how we work. Highly recommended!",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
      expect(
        screen.getByText(
          "The best investment we've made for our business this year.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Michael Chen")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Outstanding service and support. The team really cares about their customers.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Emma Wilson")).toBeInTheDocument();
    });
  });

  describe("異常系", () => {
    it("testimonials が0件の場合でも画面が表示される", async () => {
      // Given: 空のtestimonialsレスポンスモック
      const mockResponse = {
        data: {
          testimonials: [],
        },
        status: 200,
      };
      vi.mocked(getTestimonialsAPI).mockResolvedValue(mockResponse);

      // When: データ取得 → 画面レンダリング
      const testimonials = await getTestimonials();
      render(<HomeScreen testimonials={testimonials} />);

      // Then: プレースホルダー画像は表示される
      const placeholderImage = screen.getByTestId(HomeTestIds.placeholderImage);
      expect(placeholderImage).toBeInTheDocument();
    });
  });
});
