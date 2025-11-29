"use server";

import { cache } from "react";
import { getAllUsers as getAllUsersApi } from "@/shared/api/generated/functions";
import type { UserListItem } from "@/shared/api/generated/model";

export const getAllUsers = cache(async (): Promise<UserListItem[]> => {
  const response = await getAllUsersApi();
  return response.data?.users || [];
});
