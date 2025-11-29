import { CookieManager } from "@/shared/lib/cookieManager";
import { env } from "@/shared/lib/env";
import { HeaderManager } from "@/shared/lib/headerManager";
import { apiLog } from "@/shared/lib/logger";

export type FetcherOptions<TVariables> = RequestInit & {
  data?: TVariables;
  timeout?: number; // タイムアウト時間（ミリ秒）、未指定時は環境変数から取得
};

type RequestContext = {
  serverCookie: string | undefined;
  requestId: string | undefined;
  timeoutMs: number;
};

type FetchResult = {
  response: Response;
  duration: number;
};

/**
 * タイムアウトエラー
 *
 * APIリクエストがタイムアウトした際にスローされる
 */
class TimeoutError extends Error {
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
 * AbortController を使用したタイムアウト付き fetch
 */
async function fetchWithTimeout(
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

/**
 * ヘッダーをマージする
 */
function mergeHeaders(
  base: HeadersInit | undefined,
  extra?: Record<string, string>,
): HeadersInit | undefined {
  if (!extra) {
    return base;
  }

  if (!base) {
    return extra;
  }

  if (base instanceof Headers) {
    const merged = new Headers(base);
    for (const [key, value] of Object.entries(extra)) {
      merged.set(key, value);
    }
    return merged;
  }

  if (Array.isArray(base)) {
    return [...base, ...Object.entries(extra)];
  }

  return { ...base, ...extra };
}

/**
 * サーバー側のCookieを取得
 */
async function getServerCookie(): Promise<string | undefined> {
  try {
    return await CookieManager.getAccessTokenCookie();
  } catch {
    // Client側から呼ばれた場合はエラーになるので無視
  }
  return undefined;
}

/**
 * リクエストIDを取得
 */
async function getRequestId(): Promise<string | undefined> {
  return await HeaderManager.getRequestId();
}

/**
 * リクエストヘッダーを構築
 */
function buildRequestHeaders(
  optionHeaders: HeadersInit | undefined,
  body: BodyInit | null | undefined,
  serverCookie: string | undefined,
  requestId: string | undefined,
): HeadersInit | undefined {
  const contentType =
    body !== undefined &&
    body !== null &&
    !(
      optionHeaders &&
      new Headers(optionHeaders).has(HeaderManager.KEYS.CONTENT_TYPE)
    )
      ? { [HeaderManager.KEYS.CONTENT_TYPE]: "application/json" }
      : undefined;

  const cookieHeader = serverCookie
    ? { [HeaderManager.KEYS.COOKIE]: serverCookie }
    : undefined;
  const requestIdHeader = requestId
    ? { [HeaderManager.KEYS.REQUEST_ID]: requestId }
    : undefined;

  return mergeHeaders(
    mergeHeaders(mergeHeaders(optionHeaders, contentType), cookieHeader),
    requestIdHeader,
  );
}

/**
 * HTTPステータスコードに応じたエラーメッセージを生成
 */
function buildErrorMessage(status: number, isTimeout = false): string {
  if (isTimeout) {
    return "リクエストがタイムアウトしました。ネットワーク接続を確認して、再度お試しください。";
  }
  if (status === 400) {
    return "入力内容に誤りがあります。ご確認ください。";
  }
  if (status === 401) {
    return "認証に失敗しました。再度ログインしてください。";
  }
  if (status === 403) {
    return "この操作を実行する権限がありません。";
  }
  if (status === 404) {
    return "要求されたリソースが見つかりませんでした。";
  }
  if (status >= 500) {
    return "サーバーエラーが発生しました。しばらく経ってから再度お試しください。";
  }
  return "リクエストに失敗しました。もう一度お試しください。";
}

/**
 * レスポンスボディをパース
 */
function parseResponseBody(rawBody: string): unknown {
  if (rawBody.length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

/**
 * リクエストコンテキストを準備
 */
async function prepareRequestContext(
  timeout: number | undefined,
): Promise<RequestContext> {
  const [serverCookie, requestId] = await Promise.all([
    getServerCookie(),
    getRequestId(),
  ]);

  const timeoutMs = timeout ?? env.NEXT_PUBLIC_API_TIMEOUT_MS;

  return {
    serverCookie,
    requestId,
    timeoutMs,
  };
}

/**
 * HTTPリクエストを実行（タイムアウト付き）
 */
async function executeRequest(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<FetchResult> {
  const startTime = Date.now();

  const response = await fetchWithTimeout(url, options, timeoutMs);

  const duration = Date.now() - startTime;

  return { response, duration };
}

/**
 * タイムアウトエラーをハンドリング
 */
async function handleTimeoutError(
  error: TimeoutError,
  path: string,
  method: string,
  requestId: string | undefined,
  duration: number,
): Promise<never> {
  const timeoutError = new Error(buildErrorMessage(0, true));
  // @ts-expect-error - statusを追加
  timeoutError.status = 408; // Request Timeout
  // @ts-expect-error - timeoutを追加
  timeoutError.timeout = true;
  // @ts-expect-error - timeoutMsを追加
  timeoutError.timeoutMs = error.timeoutMs;

  // Log timeout error
  const { createLoggerAsync } = await import("@/shared/lib/logger");
  const logger = await createLoggerAsync(requestId);
  logger.error(
    {
      err: timeoutError,
      type: "api_timeout",
      method,
      path,
      timeoutMs: error.timeoutMs,
      duration: `${duration}ms`,
    },
    "API request timed out",
  );

  throw timeoutError;
}

/**
 * HTTPエラーレスポンスをハンドリング
 */
async function handleHttpError(
  response: Response,
  path: string,
  method: string,
  requestId: string | undefined,
  duration: number,
): Promise<never> {
  const error = new Error(buildErrorMessage(response.status));
  // @ts-expect-error - statusを追加
  error.status = response.status;
  // @ts-expect-error - responseを追加
  error.response = response;

  // Log API error with full context
  const { createLoggerAsync } = await import("@/shared/lib/logger");
  const logger = await createLoggerAsync(requestId);
  logger.error(
    {
      err: error,
      type: "api_error",
      method,
      path,
      status: response.status,
      duration: `${duration}ms`,
    },
    "API request failed",
  );

  throw error;
}

/**
 * レスポンスを処理して結果を返す
 */
async function processResponse<TData>(response: Response): Promise<TData> {
  const rawBody = await response.text();
  const parsedBody = parseResponseBody(rawBody);

  const result = {
    data: parsedBody,
    status: response.status,
    headers: response.headers,
  };

  return result as unknown as TData;
}

/**
 * APIリクエストを実行するメイン関数
 *
 * @param path - APIエンドポイントのパス
 * @param options - リクエストオプション（データ、ヘッダー、タイムアウト等）
 * @returns レスポンスデータ
 *
 * @example
 * const response = await fetcher<UserResponse>('/users', {
 *   method: 'GET',
 *   timeout: 5000,
 * });
 */
export async function fetcher<TData, TVariables = unknown>(
  path: string,
  options: FetcherOptions<TVariables> = {},
): Promise<TData> {
  // Mock mode: Dynamic import to avoid bundling in production
  if (env.NEXT_PUBLIC_API_MOCK_MODE) {
    const { mockFetcher } = await import("@/api_mock_mode/fetcher");
    return mockFetcher<TData, TVariables>(path, options);
  }

  // オプションを分解
  const { data, headers: optionHeaders, timeout, ...rest } = options;
  const method = rest.method || "GET";
  const body = data !== undefined ? JSON.stringify(data) : rest.body;

  // リクエストコンテキストを準備
  const context = await prepareRequestContext(timeout);

  // HTTPリクエストを実行
  let fetchResult: FetchResult;
  try {
    const url = `${env.NEXT_PUBLIC_API_BASE_URL}${path}`;
    const requestOptions: RequestInit = {
      ...rest,
      headers: buildRequestHeaders(
        optionHeaders,
        body,
        context.serverCookie,
        context.requestId,
      ),
      body,
      credentials: "include", // httpOnly Cookieを自動的に送信
    };

    fetchResult = await executeRequest(url, requestOptions, context.timeoutMs);
  } catch (error) {
    const duration = Date.now();

    // タイムアウトエラーのハンドリング
    if (TimeoutError.isTimeoutError(error)) {
      await handleTimeoutError(
        error,
        path,
        method,
        context.requestId,
        duration,
      );
    }

    // その他のネットワークエラー
    throw error;
  }

  const { response, duration } = fetchResult;

  // API呼び出しログを記録
  await apiLog({
    method,
    path,
    status: response.status,
    duration,
    requestId: context.requestId,
    body: data,
  });

  // HTTPエラーレスポンスのハンドリング
  if (!response.ok) {
    await handleHttpError(response, path, method, context.requestId, duration);
  }

  // 成功レスポンスを処理
  return processResponse<TData>(response);
}
