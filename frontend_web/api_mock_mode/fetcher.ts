import { HeaderManager } from "@/features/shared/lib/headerManager";
import { apiLog } from "@/features/shared/lib/logger";
import { mockMeResponse } from "./api/auth-me";
import { mockSigninResponse } from "./api/auth-signin";
import { mockSignupResponse } from "./api/auth-signup";
import { mockTestimonials, mockUserVoices } from "./api/user-voices";
import { mockUsers } from "./api/users";

// Route map for mock responses: "METHOD:path" -> response
const MOCK_ROUTES: Record<string, unknown> = {
  "GET:/testimonials": {
    data: { testimonials: mockTestimonials },
    status: 200,
  },
  "GET:/user-voices": { data: { userVoices: mockUserVoices }, status: 200 },
  "POST:/auth/signin": mockSigninResponse,
  "POST:/auth/signup": mockSignupResponse,
  "GET:/auth/me": mockMeResponse,
  "GET:/users": { data: { users: mockUsers }, status: 200 },
};

const DEFAULT_RESPONSE = { data: {}, status: 200 };

/**
 * Get mock response for a given path
 */
function getMockResponse(path: string, method: string): unknown {
  const key = `${method}:${path}`;
  return MOCK_ROUTES[key] ?? DEFAULT_RESPONSE;
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
  const { data, body } = options;
  // Parse body if it's a JSON string (from orval-generated code)
  const requestBody =
    data || (body && typeof body === "string" ? JSON.parse(body) : body);
  const startTime = Date.now();

  // Get request ID from proxy
  const requestId = await HeaderManager.getRequestId();

  // Simulate network delay for realistic testing
  await new Promise((resolve) => setTimeout(resolve, 100));

  const result = getMockResponse(path, method) as TData;
  const duration = Date.now() - startTime;

  await apiLog({
    method,
    path,
    status: 200,
    duration,
    requestId,
    isMock: true,
    body: requestBody,
  });

  return result;
}
