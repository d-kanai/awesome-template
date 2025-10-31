import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { z } from "zod";

import {
  getGetAllUsersQueryKey,
  useSignup,
} from "@/features/shared/api/generated";
import type { SignupRequest } from "@/features/shared/api/generated/model";

export const signupSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  name: z.string().min(1, "名前を入力してください"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export function useUserSignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const signupMutation = useSignup({
    mutation: {
      onSuccess: (result, variables) => {
        if (result.status === 201) {
          queryClient.invalidateQueries({
            queryKey: getGetAllUsersQueryKey(),
          });
          const name = result.data.name ?? variables.data.name ?? "ユーザー";
          Alert.alert("登録完了", `${name}さんを登録しました`, [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        }
      },
    },
  });

  const defaultValues: SignupFormValues = {
    email: "",
    name: "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      try {
        await signupMutation.mutateAsync({ data: value as SignupRequest });
        formApi.reset();
      } catch (err) {
        console.error(err);
      }
    },
  });

  return {
    form,
    isPending: signupMutation.isPending,
    error: signupMutation.error,
    schema: signupSchema,
  };
}
