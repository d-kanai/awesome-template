import { API_BASE_URL } from '@/constants/api';

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
    body !== undefined && !(headers && 'Content-Type' in headers) ? { 'Content-Type': 'application/json' } : {};

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
    throw new Error(errorText || `Request failed with status ${response.status}`);
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
