export const SHARED_ROUTES = {
  HOME: "/",
} as const;

export type SharedRoute = (typeof SHARED_ROUTES)[keyof typeof SHARED_ROUTES];
