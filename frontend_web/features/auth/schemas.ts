import { z } from "zod";

export const signinFormSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

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
