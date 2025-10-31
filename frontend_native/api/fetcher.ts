import { API_BASE_URL } from "@/constants/api";

type FetcherOptions<TVariables> = RequestInit & {
  data?: TVariables;
};

export async function fetcher<TData, TVariables = unknown>(
  path: string,
  options: FetcherOptions<TVariables> = {},
): Promise<TData> {
  const { data, headers, ...rest } = options;

  const body = data !== undefined ? JSON.stringify(data) : rest.body;
  const contentType =
    body !== undefined && !(headers && "Content-Type" in headers)
      ? { "Content-Type": "application/json" }
      : {};

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...contentType,
      ...headers,
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorJson = JSON.parse(errorText);
      // Spring Bootのエラーレスポンス形式に対応
      if (errorJson.message) {
        errorMessage = errorJson.message;
      } else if (errorJson.error) {
        errorMessage = errorJson.error;
      } else if (typeof errorJson === "string") {
        errorMessage = errorJson;
      }
    } catch {
      // JSONパースに失敗した場合はテキストをそのまま使用
      if (errorText) {
        errorMessage = errorText;
      }
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
