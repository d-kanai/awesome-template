import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/figma_generated/Card";
import { SignupForm } from "../components/SignupForm";

/**
 * SignupScreen
 * サインアップ画面
 */
export function SignupScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">サインアップ</CardTitle>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
