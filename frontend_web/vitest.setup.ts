import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// next/navigationのグローバルモック
vi.mock("next/navigation", () => require("next-router-mock"));

// テスト後のクリーンアップ
afterEach(() => {
  cleanup();
});
