import { useForm } from "@tanstack/react-form";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { z } from "zod";

import { useSignin } from "@/features/shared/api/generated";
import type { SigninRequest } from "@/features/shared/api/generated/model";

export const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SigninFormValues = z.infer<typeof signinSchema>;

export function useSigninForm() {
  const router = useRouter();

  const signinMutation = useSignin({
    mutation: {
      onSuccess: (result) => {
        if (result.status === 200) {
          const email = result.data.email ?? "User";
          Alert.alert("Success", `Welcome back, ${email}!`, [
            {
              text: "OK",
              onPress: () => router.push("/users"),
            },
          ]);
        }
      },
      onError: () => {
        Alert.alert("Error", "Invalid email or password");
      },
    },
  });

  const defaultValues: SigninFormValues = {
    email: "",
    password: "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      try {
        await signinMutation.mutateAsync({ data: value as SigninRequest });
        formApi.reset();
      } catch (err) {
        console.error(err);
      }
    },
  });

  return {
    form,
    isPending: signinMutation.isPending,
    error: signinMutation.error,
    schema: signinSchema,
  };
}
