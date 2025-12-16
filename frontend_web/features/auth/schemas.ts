import { z } from "zod";

// Magic Link用スキーマ（パスワードレス認証）
export const magicLinkFormSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
});

export type MagicLinkFormData = z.infer<typeof magicLinkFormSchema>;

export const magicLinkFormDefaults = {
  email: "",
} satisfies MagicLinkFormData;

// 以下は後方互換性のために残す（削除候補）
// @deprecated Magic Link認証に移行後は削除予定
export const signinFormSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

// @deprecated Magic Link認証に移行後は削除予定
export const signupFormSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(100, "パスワードは100文字以内で入力してください"),
});

export type SigninFormData = z.infer<typeof signinFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;

export const signinFormDefaults = {
  email: "",
  password: "",
} satisfies SigninFormData;

export const signupFormDefaults = {
  email: "",
  password: "",
} satisfies SignupFormData;
