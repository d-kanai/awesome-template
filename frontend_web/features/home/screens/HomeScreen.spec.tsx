import { getTestimonials } from "@/features/home/data/getTestimonials";
import { HomeScreen } from "./HomeScreen";
import { HomeTestIds } from "../test-ids";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/home/data/getTestimonials", () => ({
  getTestimonials: vi.fn(),
}));

describe("HomeScreen - TestC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("正常系", () => {
    it("ホーム画面が正しく表示される", async () => {
      // When: データ取得 → 画面レンダリング
      const testimonials = await getTestimonials();
      render(<HomeScreen testimonials={testimonials} />);

      // Then: 画面にコンテンツが表示される
      // プレースホルダー画像が表示される
      const placeholderImage = screen.getByTestId(HomeTestIds.placeholderImage);
      expect(placeholderImage).toBeInTheDocument();

      // Then: API呼び出し
      expect(getTestimonials).toHaveBeenCalledTimes(1);
    });

    it("testimonials が正しく表示される", async () => {
      // Given: 複数のtestimonialsデータ
      const mockTestimonials = [
        {
          quote: "Great product!",
          title: "John Doe",
          description: "Developer",
          avatarSrc: "https://i.pravatar.cc/150?img=1",
        },
        {
          quote: "Highly recommended!",
          title: "Jane Smith",
          description: "Designer",
          avatarSrc: "https://i.pravatar.cc/150?img=2",
        },
        {
          quote: "Amazing experience!",
          title: "Bob Wilson",
          description: "Manager",
          avatarSrc: "https://i.pravatar.cc/150?img=3",
        },
      ];
      vi.mocked(getTestimonials).mockResolvedValue(mockTestimonials);

      // When: データ取得 → 画面レンダリング
      const testimonials = await getTestimonials();
      render(<HomeScreen testimonials={testimonials} />);

      // Then: testimonials の内容が表示される
      expect(screen.getByText("Great product!")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Highly recommended!")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Amazing experience!")).toBeInTheDocument();
      expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
    });
  });

  describe("異常系", () => {
    it("testimonials が0件の場合でも画面が表示される", async () => {
      // Given: 空のtestimonialsデータ
      vi.mocked(getTestimonials).mockResolvedValue([]);

      // When: データ取得 → 画面レンダリング
      const testimonials = await getTestimonials();
      render(<HomeScreen testimonials={testimonials} />);

      // Then: プレースホルダー画像は表示される
      const placeholderImage = screen.getByTestId(HomeTestIds.placeholderImage);
      expect(placeholderImage).toBeInTheDocument();

      // Then: API呼び出し
      expect(getTestimonials).toHaveBeenCalledTimes(1);
    });
  });
});
