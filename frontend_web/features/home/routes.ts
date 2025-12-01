export const HOME_ROUTES = {
  ROOT: "/",
  HOME: "/home",
} as const;

export type HomeRoute = (typeof HOME_ROUTES)[keyof typeof HOME_ROUTES];
