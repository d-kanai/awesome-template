"use server";

import { z } from "zod";
import { env } from "@/shared/lib/env";

const sendOtpSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
});

export type SendOtpActionResponse = {
  success?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"email", string[]>>;
};

/**
 * Auth0 Passwordless OTPコード送信
 *
 * サーバーサイドでAuth0 Authentication APIを直接呼び出し、
 * 指定されたメールアドレスに6桁のOTPコードを送信する
 */
export async function sendOtpAction(data: {
  email: string;
}): Promise<SendOtpActionResponse> {
  const validatedData = sendOtpSchema.safeParse(data);

  if (!validatedData.success) {
    const fieldErrors: Partial<Record<"email", string[]>> = {};
    for (const error of validatedData.error.errors) {
      const field = error.path[0] as "email";
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(error.message);
    }
    return { fieldErrors };
  }

  try {
    const response = await fetch(
      `https://${env.NEXT_PUBLIC_AUTH0_DOMAIN}/passwordless/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          connection: "email",
          email: validatedData.data.email,
          send: "code", // OTPコードを送信
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // biome-ignore lint/suspicious/noConsole: Server Action logging
      console.error("Auth0 passwordless/start error:", errorData);

      const errorMessage =
        errorData.error_description ||
        errorData.error ||
        "コードの送信に失敗しました";

      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Server Action logging
    console.error("sendOtpAction error:", error);
    return { error: "コードの送信中にエラーが発生しました" };
  }
}
