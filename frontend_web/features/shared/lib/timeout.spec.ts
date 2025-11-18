import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TimeoutError, withTimeout, fetchWithTimeout } from "./timeout";

describe("TimeoutError", () => {
  describe("正常系", () => {
    it("エラーインスタンスが正しく生成される", () => {
      const error = new TimeoutError("Test timeout", 5000, "Test operation");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TimeoutError);
      expect(error.name).toBe("TimeoutError");
      expect(error.message).toBe("Test timeout");
      expect(error.timeoutMs).toBe(5000);
      expect(error.operation).toBe("Test operation");
    });

    it("Type guardが正しく動作する", () => {
      const timeoutError = new TimeoutError("Timeout", 1000);
      const normalError = new Error("Normal error");

      expect(TimeoutError.isTimeoutError(timeoutError)).toBe(true);
      expect(TimeoutError.isTimeoutError(normalError)).toBe(false);
      expect(TimeoutError.isTimeoutError(null)).toBe(false);
      expect(TimeoutError.isTimeoutError(undefined)).toBe(false);
      expect(TimeoutError.isTimeoutError("string")).toBe(false);
    });
  });
});

describe("withTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("正常系", () => {
    it("タイムアウト前に完了したPromiseは正常に解決される", async () => {
      // Given: 100ms後に完了するPromise
      const promise = new Promise((resolve) => {
        setTimeout(() => resolve("success"), 100);
      });

      // When: 1000msのタイムアウトを設定
      const resultPromise = withTimeout(promise, 1000, "Test");

      // タイマーを100ms進める
      vi.advanceTimersByTime(100);

      // Then: 正常に解決される
      await expect(resultPromise).resolves.toBe("success");
    });

    it("タイムアウト時間内に完了すればタイマーがクリアされる", async () => {
      // Given: すぐに完了するPromise
      const promise = Promise.resolve("immediate");

      // When: タイムアウト付きで実行
      await withTimeout(promise, 1000);

      // Then: タイマーがクリアされる（clearTimeoutが呼ばれる）
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe("異常系", () => {
    it("タイムアウト時間を超えるとTimeoutErrorがスローされる", async () => {
      // Given: 2000ms後に完了するPromise
      const promise = new Promise((resolve) => {
        setTimeout(() => resolve("late"), 2000);
      });

      // When: 1000msのタイムアウトを設定
      const resultPromise = withTimeout(promise, 1000, "Slow Operation");

      // タイマーを1000ms進める
      vi.advanceTimersByTime(1000);

      // Then: TimeoutErrorがスローされる
      await expect(resultPromise).rejects.toThrow(TimeoutError);
      await expect(resultPromise).rejects.toThrow(
        "Slow Operation timed out after 1000ms",
      );
    });

    it("タイムアウト後に元のPromiseが解決されてもタイマーがクリアされる", async () => {
      // Given: 2000ms後に完了するPromise
      const promise = new Promise((resolve) => {
        setTimeout(() => resolve("late"), 2000);
      });

      // When: 1000msのタイムアウトを設定
      const resultPromise = withTimeout(promise, 1000);

      // タイマーを1000ms進める（タイムアウト発生）
      vi.advanceTimersByTime(1000);

      // Then: エラーがスローされる
      await expect(resultPromise).rejects.toThrow(TimeoutError);

      // さらに時間を進めても問題ない（クリーンアップされている）
      vi.advanceTimersByTime(1000);
      expect(vi.getTimerCount()).toBe(0);
    });
  });
});

describe("fetchWithTimeout", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  describe("正常系", () => {
    it("タイムアウト前に完了したfetchは正常に解決される", async () => {
      // Given: モックfetchが100ms後にレスポンスを返す
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(new Response("OK", { status: 200 }));
            }, 100);
          }),
      );

      // When: 1000msのタイムアウトで実行
      const resultPromise = fetchWithTimeout(
        "https://api.example.com/test",
        {},
        1000,
      );

      // タイマーを100ms進める
      vi.advanceTimersByTime(100);

      // Then: 正常にレスポンスが返る
      const response = await resultPromise;
      expect(response.status).toBe(200);
      expect(await response.text()).toBe("OK");
    });
  });

  describe("異常系", () => {
    it("タイムアウト時間を超えるとTimeoutErrorがスローされる", async () => {
      // Given: モックfetchが2000ms後にレスポンスを返す（タイムアウトより遅い）
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(new Response("Too late", { status: 200 }));
            }, 2000);
          }),
      );

      // When: 1000msのタイムアウトで実行
      const resultPromise = fetchWithTimeout(
        "https://api.example.com/slow",
        {},
        1000,
      );

      // タイマーを1000ms進める
      vi.advanceTimersByTime(1000);

      // Then: TimeoutErrorがスローされる
      await expect(resultPromise).rejects.toThrow(TimeoutError);
      await expect(resultPromise).rejects.toThrow(
        "Request to https://api.example.com/slow timed out after 1000ms",
      );
    });

    it("AbortErrorがTimeoutErrorに変換される", async () => {
      // Given: AbortErrorをスローするfetch
      global.fetch = vi.fn().mockRejectedValue(
        Object.assign(new Error("The operation was aborted"), {
          name: "AbortError",
        }),
      );

      // When: fetchWithTimeoutを実行
      const resultPromise = fetchWithTimeout(
        "https://api.example.com/aborted",
        {},
        1000,
      );

      // Then: TimeoutErrorに変換される
      await expect(resultPromise).rejects.toThrow(TimeoutError);
    });

    it("AbortError以外のエラーはそのまま伝播される", async () => {
      // Given: ネットワークエラーをスローするfetch
      const networkError = new Error("Network error");
      global.fetch = vi.fn().mockRejectedValue(networkError);

      // When: fetchWithTimeoutを実行
      const resultPromise = fetchWithTimeout(
        "https://api.example.com/error",
        {},
        1000,
      );

      // Then: 元のエラーがそのままスローされる
      await expect(resultPromise).rejects.toThrow("Network error");
      await expect(resultPromise).rejects.not.toThrow(TimeoutError);
    });
  });
});
