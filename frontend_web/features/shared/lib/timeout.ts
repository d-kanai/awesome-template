/**
 * Timeout関連のエラーとユーティリティ
 */

/**
 * タイムアウトエラー
 *
 * APIリクエストやその他の非同期処理がタイムアウトした際にスローされる
 */
export class TimeoutError extends Error {
  public readonly timeoutMs: number;
  public readonly operation: string;

  constructor(message: string, timeoutMs: number, operation = "Operation") {
    super(message);
    this.name = "TimeoutError";
    this.timeoutMs = timeoutMs;
    this.operation = operation;

    // V8のstack traceサポート
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutError);
    }
  }

  /**
   * Type guard: TimeoutErrorかどうかを判定
   */
  static isTimeoutError(error: unknown): error is TimeoutError {
    return error instanceof TimeoutError;
  }
}

/**
 * Promise にタイムアウトを設定する
 *
 * @param promise - タイムアウトを設定する Promise
 * @param timeoutMs - タイムアウト時間（ミリ秒）
 * @param operation - 操作名（エラーメッセージ用）
 * @returns タイムアウト付きの Promise
 *
 * @example
 * const result = await withTimeout(
 *   fetch('https://api.example.com/data'),
 *   5000,
 *   'API Request'
 * );
 *
 * @example
 * try {
 *   const data = await withTimeout(
 *     slowOperation(),
 *     3000,
 *     'Slow Operation'
 *   );
 * } catch (error) {
 *   if (TimeoutError.isTimeoutError(error)) {
 *     console.log(`Timeout after ${error.timeoutMs}ms`);
 *   }
 * }
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation = "Operation",
): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new TimeoutError(
          `${operation} timed out after ${timeoutMs}ms`,
          timeoutMs,
          operation,
        ),
      );
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * AbortController を使用したタイムアウト付き fetch
 *
 * @param input - fetch の URL または Request
 * @param init - fetch のオプション
 * @param timeoutMs - タイムアウト時間（ミリ秒）
 * @returns fetch の Response
 *
 * @example
 * const response = await fetchWithTimeout(
 *   'https://api.example.com/data',
 *   { method: 'GET' },
 *   5000
 * );
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = 30000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    // AbortError をより分かりやすい TimeoutError に変換
    if (error instanceof Error && error.name === "AbortError") {
      throw new TimeoutError(
        `Request to ${input.toString()} timed out after ${timeoutMs}ms`,
        timeoutMs,
        "API Request",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
