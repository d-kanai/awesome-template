import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_ROUTES } from "@/features/auth/routes";
import { USER_ROUTES } from "@/features/user/routes";
import { me } from "@/shared/api/generated/functions";
import { CookieManager } from "@/shared/lib/cookieManager";
import RootPage from "./page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/shared/api/generated/functions", () => ({
  me: vi.fn(),
}));

vi.mock("@/shared/lib/cookieManager", () => ({
  CookieManager: {
    getAccessToken: vi.fn(),
  },
}));

describe("RootPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("認証済みの場合", () => {
    it("ユーザー一覧ページにリダイレクトする", async () => {
      // Given: アクセストークンあり、me API成功
      vi.mocked(CookieManager.getAccessToken).mockResolvedValue("valid-token");
      vi.mocked(me).mockResolvedValue({
        data: { id: "user-1", email: "test@example.com" },
        status: 200,
      });

      // When: RootPageを実行
      await RootPage();

      // Then: ユーザー一覧へリダイレクト
      expect(CookieManager.getAccessToken).toHaveBeenCalledTimes(1);
      expect(me).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith(USER_ROUTES.USER_LIST);
    });
  });

  describe("未認証の場合", () => {
    it("アクセストークンがない場合、サインインページにリダイレクトする", async () => {
      // Given: アクセストークンなし
      vi.mocked(CookieManager.getAccessToken).mockResolvedValue(undefined);

      // When: RootPageを実行
      await RootPage();

      // Then: サインインへリダイレクト
      expect(CookieManager.getAccessToken).toHaveBeenCalledTimes(1);
      expect(me).not.toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith(AUTH_ROUTES.SIGNIN);
    });

    it("me APIが失敗した場合、サインインページにリダイレクトする", async () => {
      // Given: アクセストークンあり、me API失敗
      vi.mocked(CookieManager.getAccessToken).mockResolvedValue("valid-token");
      vi.mocked(me).mockResolvedValue({
        data: undefined as never,
        status: 401,
      });

      // When: RootPageを実行
      await RootPage();

      // Then: サインインへリダイレクト
      expect(redirect).toHaveBeenCalledWith(AUTH_ROUTES.SIGNIN);
    });

    it("me APIがエラーを投げた場合、サインインページにリダイレクトする", async () => {
      // Given: アクセストークンあり、me APIエラー
      vi.mocked(CookieManager.getAccessToken).mockResolvedValue("valid-token");
      vi.mocked(me).mockRejectedValue(new Error("Network error"));

      // When: RootPageを実行
      await RootPage();

      // Then: サインインへリダイレクト
      expect(redirect).toHaveBeenCalledWith(AUTH_ROUTES.SIGNIN);
    });
  });
});
