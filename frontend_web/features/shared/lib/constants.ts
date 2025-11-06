export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const ROUTES = {
  HOME: "/",
  USER_LIST: "/user",
  SIGNIN: "/auth/signin",
  SIGNUP: "/auth/signup",
} as const;

export const COOKIE_KEYS = {
  ACCESS_TOKEN: "accessToken",
} as const;

export const FEATURE_FLAGS = {
  SHOW_VERSION_INFO: "show-version-info",
} as const;
