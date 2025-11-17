import { API_BASE_URL } from "@/features/shared/api/config";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { env } from "@/features/shared/lib/env";
import { logApiRequest } from "@/features/shared/lib/logger";
import { headers } from "next/headers";

type FetcherOptions<TVariables> = RequestInit & {
  data?: TVariables;
};

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

async function getServerCookie(): Promise<string | undefined> {
  try {
    return await CookieManager.getAccessTokenCookie();
  } catch {
    // Client側から呼ばれた場合はエラーになるので無視
  }
  return undefined;
}

async function getRequestId(): Promise<string | undefined> {
  try {
    const headersList = await headers();
    return headersList.get("x-request-id") || undefined;
  } catch {
    // Client-side or headers not available
  }
  return undefined;
}

function buildRequestHeaders(
  optionHeaders: HeadersInit | undefined,
  body: BodyInit | null | undefined,
  serverCookie: string | undefined,
  requestId: string | undefined,
): HeadersInit | undefined {
  const contentType =
    body !== undefined &&
    body !== null &&
    !(optionHeaders && new Headers(optionHeaders).has("Content-Type"))
      ? { "Content-Type": "application/json" }
      : undefined;

  const cookieHeader = serverCookie ? { Cookie: serverCookie } : undefined;
  const requestIdHeader = requestId ? { "X-Request-Id": requestId } : undefined;

  return mergeHeaders(
    mergeHeaders(mergeHeaders(optionHeaders, contentType), cookieHeader),
    requestIdHeader,
  );
}

function buildErrorMessage(status: number): string {
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

export async function fetcher<TData, TVariables = unknown>(
  path: string,
  options: FetcherOptions<TVariables> = {},
): Promise<TData> {
  // Mock mode: Dynamic import to avoid bundling in production
  if (env.NEXT_PUBLIC_API_MOCK_MODE) {
    const { mockFetcher } = await import("@/api_mock_mode/fetcher");
    return mockFetcher<TData, TVariables>(path, options);
  }

  // Real API mode
  const { data, headers: optionHeaders, ...rest } = options;
  const body = data !== undefined ? JSON.stringify(data) : rest.body;
  const serverCookie = await getServerCookie();
  const requestId = await getRequestId();

  const startTime = Date.now();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: buildRequestHeaders(optionHeaders, body, serverCookie, requestId),
    body,
    credentials: "include", // httpOnly Cookieを自動的に送信
  });

  const duration = Date.now() - startTime;

  await logApiRequest(
    rest.method || "GET",
    path,
    response.status,
    duration,
    requestId,
    false,
    data,
  );

  if (!response.ok) {
    const error = new Error(buildErrorMessage(response.status));
    // @ts-expect-error - statusを追加
    error.status = response.status;
    // @ts-expect-error - responseを追加
    error.response = response;
    throw error;
  }

  const rawBody = await response.text();
  const parsedBody = parseResponseBody(rawBody);

  const result = {
    data: parsedBody,
    status: response.status,
    headers: response.headers,
  };

  return result as unknown as TData;
}
