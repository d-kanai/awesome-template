import type { z } from "zod";

export function formatZodFieldErrors<T extends Record<string, unknown>>(
  errors: z.ZodIssue[],
): Partial<Record<keyof T, string[]>> {
  const fieldErrors: Partial<Record<keyof T, string[]>> = {};
  for (const issue of errors) {
    const field = issue.path[0] as keyof T | undefined;
    if (field) {
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field]?.push(issue.message);
    }
  }
  return fieldErrors;
}
