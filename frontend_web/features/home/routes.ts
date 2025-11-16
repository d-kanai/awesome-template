export const HOME_ROUTES = {
  HOME: "/home",
} as const;

export type HomeRoute = (typeof HOME_ROUTES)[keyof typeof HOME_ROUTES];
