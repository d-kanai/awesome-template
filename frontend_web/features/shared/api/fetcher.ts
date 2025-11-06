import { API_BASE_URL } from "@/features/shared/lib/constants";

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

export async function fetcher<TData, TVariables = unknown>(
  path: string,
  options: FetcherOptions<TVariables> = {},
): Promise<TData> {
  const { data, headers, ...rest } = options;

  const body = data !== undefined ? JSON.stringify(data) : rest.body;
  const contentType =
    body !== undefined && !(headers && new Headers(headers).has("Content-Type"))
      ? { "Content-Type": "application/json" }
      : undefined;

  console.log("[fetcher] Request:", {
    url: `${API_BASE_URL}${path}`,
    method: rest.method,
    body: body ? JSON.parse(typeof body === "string" ? body : "{}") : undefined,
  });

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: mergeHeaders(headers, contentType),
    body,
    credentials: "include", // httpOnly Cookieを自動的に送信
  });

  console.log("[fetcher] Response:", {
    url: `${API_BASE_URL}${path}`,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    const error = new Error(
      "リクエストに失敗しました。もう一度お試しください。",
    );
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
