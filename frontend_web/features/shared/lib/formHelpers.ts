import type { z } from "zod";

export type FormValidationResult<T> =
  | { success: true; data: T }
  | { success: false; fieldErrors: Partial<Record<keyof T, string[]>> };

export function extractFormData<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  formData: FormData,
): FormValidationResult<z.infer<T>> {
  const rawData = Object.fromEntries(
    Object.keys(schema.shape).map((key) => [key, formData.get(key)]),
  );
  const result = schema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: formatZodFieldErrors<z.infer<T>>(result.error.errors),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

function formatZodFieldErrors<T extends Record<string, unknown>>(
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
