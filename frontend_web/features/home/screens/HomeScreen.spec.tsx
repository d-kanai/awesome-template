import { getTestimonials } from "@/features/home/data/getTestimonials";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeTestIds } from "../test-ids";
import { HomeScreen } from "./HomeScreen";

describe("HomeScreen - TestC", () => {
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
      // expect(getTestimonials).toHaveBeenCalledTimes(1);
    });

    it("testimonials が正しく表示される", async () => {
      // When: データ取得 → 画面レンダリング
      const testimonials = await getTestimonials();
      render(<HomeScreen testimonials={testimonials} />);

      // Then: testimonialsの内容が表示される（ハードコードされたデータをアサート）
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
    it("testimonials が0件の場合でも画面が表示される", () => {
      // Given: 空のtestimonialsデータ
      const testimonials: Awaited<ReturnType<typeof getTestimonials>> = [];

      // When: 画面レンダリング
      render(<HomeScreen testimonials={testimonials} />);

      // Then: プレースホルダー画像は表示される
      const placeholderImage = screen.getByTestId(HomeTestIds.placeholderImage);
      expect(placeholderImage).toBeInTheDocument();
    });
  });
});
