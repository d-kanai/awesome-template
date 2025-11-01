import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useSignupForm } from "@/features/auth/hooks/useSignupForm";

const getErrorMessage = (error: unknown) => {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return JSON.stringify(error);
};

export function SignupForm() {
  const { form, isPending, error, schema } = useSignupForm();
  const signupError = getErrorMessage(error);

  return (
    <View style={styles.form}>
      <form.Field
        name="email"
        validators={{
          onChange: schema.shape.email,
        }}
      >
        {(field) => (
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="example@email.com"
              testID="signup-email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            {field.state.meta.errors.length > 0 ? (
              <Text style={styles.fieldError}>
                {getErrorMessage(field.state.meta.errors[0])}
              </Text>
            ) : null}
          </View>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: schema.shape.password,
        }}
      >
        {(field) => (
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Enter your password"
              testID="signup-password"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              textContentType="none"
              style={styles.input}
            />
            {field.state.meta.errors.length > 0 ? (
              <Text style={styles.fieldError}>
                {getErrorMessage(field.state.meta.errors[0])}
              </Text>
            ) : null}
          </View>
        )}
      </form.Field>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          isPending ? styles.buttonDisabled : null,
          pressed ? styles.buttonPressed : null,
        ]}
        testID="signup-submit"
        onPress={() => {
          form.handleSubmit().catch((err) => {
            console.error(err);
          });
        }}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? "Signing up..." : "Sign Up"}
        </Text>
      </Pressable>

      {signupError ? (
        <Text style={styles.mutationError}>{signupError}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e2e2",
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  fieldError: {
    color: "#c1121f",
    fontSize: 14,
  },
  mutationError: {
    color: "#c1121f",
    fontSize: 15,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#0077cc",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
