import { API_BASE_URL } from "@/features/shared/api/config";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { logApiRequest } from "@/features/shared/lib/logger";

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

export async function fetcher<TData, TVariables = unknown>(
  path: string,
  options: FetcherOptions<TVariables> = {},
): Promise<TData> {
  // Mock mode: Dynamic import to avoid bundling in production
  if (process.env.NEXT_PUBLIC_API_MOCK_MODE === "enabled") {
    const { mockFetcher } = await import("@/api_mock_mode/fetcher");
    return mockFetcher<TData, TVariables>(path, options);
  }

  // Real API mode
  const { data, headers, ...rest } = options;

  const body = data !== undefined ? JSON.stringify(data) : rest.body;
  const contentType =
    body !== undefined && !(headers && new Headers(headers).has("Content-Type"))
      ? { "Content-Type": "application/json" }
      : undefined;

  // Server Component/Server Actionから呼ばれた場合は自動的にCookieを設定
  const serverCookie = await getServerCookie();
  const cookieHeader = serverCookie ? { Cookie: serverCookie } : undefined;

  const startTime = Date.now();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: mergeHeaders(mergeHeaders(headers, contentType), cookieHeader),
    body,
    credentials: "include", // httpOnly Cookieを自動的に送信
  });

  const duration = Date.now() - startTime;

  await logApiRequest(rest.method || "GET", path, response.status, duration);

  if (!response.ok) {
    let errorMessage: string;

    if (response.status === 400) {
      errorMessage = "入力内容に誤りがあります。ご確認ください。";
    } else if (response.status === 401) {
      errorMessage = "認証に失敗しました。再度ログインしてください。";
    } else if (response.status === 403) {
      errorMessage = "この操作を実行する権限がありません。";
    } else if (response.status === 404) {
      errorMessage = "要求されたリソースが見つかりませんでした。";
    } else if (response.status >= 500) {
      errorMessage =
        "サーバーエラーが発生しました。しばらく経ってから再度お試しください。";
    } else {
      errorMessage = "リクエストに失敗しました。もう一度お試しください。";
    }

    const error = new Error(errorMessage);
    // @ts-expect-error - statusを追加
    error.status = response.status;
    // @ts-expect-error - responseを追加
    error.response = response;
    throw error;
  }

  const rawBody = await response.text();

  const parsedBody =
    rawBody.length === 0
      ? undefined
      : (() => {
          try {
            return JSON.parse(rawBody);
          } catch {
            return rawBody;
          }
        })();

  const result = {
    data: parsedBody,
    status: response.status,
    headers: response.headers,
  };

  return result as unknown as TData;
}
