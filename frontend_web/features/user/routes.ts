export const USER_ROUTES = {
  USER_LIST: "/user",
} as const;

export type UserRoute = (typeof USER_ROUTES)[keyof typeof USER_ROUTES];
