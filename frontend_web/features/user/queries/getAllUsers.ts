"use server";

import { cache } from "react";
import { getAllUsers as getAllUsersApi } from "@/features/shared/api/generated/functions";
import type { UserListItem } from "@/features/shared/api/generated/model";

export const getAllUsers = cache(async (): Promise<UserListItem[]> => {
  const response = await getAllUsersApi();
  return response.data?.users || [];
});
