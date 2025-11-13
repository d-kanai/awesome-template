import {
  mockTestimonials,
  mockUsers,
  mockSigninResponse,
  mockSignupResponse,
  mockMeResponse,
} from "./data";

/**
 * Get mock response for a given path
 * Returns mock data based on the API endpoint
 */
function getMockResponse(path: string, method: string): unknown {
  // GET /testimonials
  if (path === "/testimonials" && method === "GET") {
    return {
      data: { testimonials: mockTestimonials },
      status: 200,
    };
  }

  // POST /auth/signin
  if (path === "/auth/signin" && method === "POST") {
    return mockSigninResponse;
  }

  // POST /auth/signup
  if (path === "/auth/signup" && method === "POST") {
    return mockSignupResponse;
  }

  // GET /auth/me
  if (path === "/auth/me" && method === "GET") {
    return mockMeResponse;
  }

  // GET /users
  if (path === "/users" && method === "GET") {
    return {
      data: { users: mockUsers },
      status: 200,
    };
  }

  // Default: return empty response
  console.warn(`[mockFetcher] No mock data defined for: ${method} ${path}`);
  return {
    data: {},
    status: 200,
  };
}

/**
 * Mock API fetcher
 * Always returns mock data - used only in development with NEXT_PUBLIC_API_MOCK_MODE=enabled
 * Safe to use in both Server and Client Components
 *
 * This fetcher is called from:
 * 1. api_mock_mode/functions.ts (when using openapi.json endpoints)
 * 2. features/shared/api/fetcher.ts (when NEXT_PUBLIC_API_MOCK_MODE=enabled, mocks ALL API calls)
 *
 * Note: After backend implementation, switch imports from api_mock_mode/functions to features/shared/api/generated/functions
 */
export async function mockFetcher<TData, TVariables = unknown>(
  path: string,
  options: RequestInit & { data?: TVariables } = {},
): Promise<TData> {
  const method = options.method || "GET";

  // Simulate network delay for realistic testing
  await new Promise((resolve) => setTimeout(resolve, 100));

  return getMockResponse(path, method) as TData;
}
