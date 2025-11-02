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
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export function useSignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const signupMutation = useSignup({
    mutation: {
      onSuccess: (result, variables) => {
        if (result.status === 201) {
          queryClient.invalidateQueries({
            queryKey: getGetAllUsersQueryKey(),
          });
          const email = result.data.email ?? variables.data.email ?? "User";
          Alert.alert("Success", `Account created for ${email}`, [
            {
              text: "OK",
              onPress: () => router.push("/"),
            },
          ]);
        }
      },
    },
  });

  const defaultValues: SignupFormValues = {
    email: "",
    password: "",
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
