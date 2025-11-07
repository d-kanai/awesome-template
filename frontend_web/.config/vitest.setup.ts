import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// next/navigationのグローバルモック
const mockRouter = require("next-router-mock");
vi.mock("next/navigation", () => ({
	...mockRouter,
	useRouter: () => mockRouter.default,
}));

// next/headersのグローバルモック
vi.mock("next/headers", () => ({
	cookies: vi.fn(async () => ({
		get: vi.fn(),
		set: vi.fn(),
		delete: vi.fn(),
	})),
}));

// テスト後のクリーンアップ
afterEach(() => {
	cleanup();
});
