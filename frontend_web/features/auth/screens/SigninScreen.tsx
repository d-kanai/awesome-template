import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/figma_generated/Card";
import { SigninForm } from "../components/SigninForm";

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md">
      <Card>{children}</Card>
    </div>
  );
}

function Header() {
  return (
    <CardHeader>
      <CardTitle className="text-center">サインイン</CardTitle>
    </CardHeader>
  );
}

function Content() {
  return (
    <CardContent>
      <SigninForm />
    </CardContent>
  );
}

export function SigninScreen() {
  return (
    <ScreenContainer>
      <FormCard>
        <Header />
        <Content />
      </FormCard>
    </ScreenContainer>
  );
}
