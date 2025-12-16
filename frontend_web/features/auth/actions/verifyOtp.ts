"use server";

import { z } from "zod";
import { HOME_ROUTES } from "@/features/home/routes";
import { CookieManager } from "@/shared/lib/cookieManager";
import { env } from "@/shared/lib/env";

const verifyOtpSchema = z.object({
  email: z.string().email(),
  code: z
    .string()
    .min(1, "コードを入力してください")
    .regex(/^\d{6}$/, "6桁の数字を入力してください"),
});

export type VerifyOtpActionResponse = {
  success?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"code", string[]>>;
  redirectTo?: string;
  user?: {
    id: string;
    email: string;
  };
};

interface Auth0TokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

interface Auth0IdTokenPayload {
  sub: string;
  email?: string;
}

/**
 * JWTのペイロードをデコード
 */
function decodeIdToken(idToken: string): Auth0IdTokenPayload | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;

    const payloadPart = parts[1];
    if (!payloadPart) return null;

    // Base64URL to Base64
    let base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const payload = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Auth0 Passwordless OTPコード検証
 *
 * サーバーサイドでAuth0 Authentication APIを直接呼び出し、
 * OTPコードを検証してアクセストークンを取得する
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Auth0 OTP verification flow
export async function verifyOtpAction(data: {
  email: string;
  code: string;
}): Promise<VerifyOtpActionResponse> {
  const validatedData = verifyOtpSchema.safeParse(data);

  if (!validatedData.success) {
    const fieldErrors: Partial<Record<"code", string[]>> = {};
    for (const error of validatedData.error.errors) {
      const field = error.path[0] as "code";
      if (field === "code") {
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(error.message);
      }
    }
    return { fieldErrors };
  }

  try {
    const clientSecret = env.AUTH0_CLIENT_SECRET?.trim();
    const requestBody = {
      grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
      client_id: env.NEXT_PUBLIC_AUTH0_CLIENT_ID?.trim(),
      client_secret: clientSecret,
      realm: "email",
      username: validatedData.data.email,
      otp: validatedData.data.code,
      scope: "openid email profile",
    };

    const response = await fetch(
      `https://${env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // biome-ignore lint/suspicious/noConsole: Server Action logging
      console.error("Auth0 oauth/token error:", errorData);

      let errorMessage = "認証に失敗しました";
      if (errorData.error === "invalid_grant") {
        errorMessage = "コードが無効または期限切れです";
      } else if (errorData.error_description) {
        errorMessage = errorData.error_description;
      }

      return { error: errorMessage };
    }

    const tokenData: Auth0TokenResponse = await response.json();

    // ID Tokenからユーザー情報を取得
    const idTokenPayload = decodeIdToken(tokenData.id_token);
    if (!idTokenPayload) {
      return { error: "ユーザー情報の取得に失敗しました" };
    }

    // アクセストークンをCookieに保存
    await CookieManager.setAccessToken(tokenData.access_token);

    return {
      success: true,
      redirectTo: HOME_ROUTES.HOME,
      user: {
        id: idTokenPayload.sub,
        email: idTokenPayload.email || validatedData.data.email,
      },
    };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Server Action logging
    console.error("verifyOtpAction error:", error);
    return { error: "認証中にエラーが発生しました" };
  }
}
