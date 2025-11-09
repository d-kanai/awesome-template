import { ThemeToggle } from "@/features/shared/components/ThemeToggle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/figma_generated/Card";
import { Header as PageHeader } from "@/features/shared/figma_generated/Header";
import { SigninForm } from "../components/SigninForm";

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background-secondary">
      <PageHeader platform="desktop" state="default" />
      <div className="flex flex-1 items-center justify-center px-Space-400 py-Space-1200 sm:px-Space-600 lg:px-Space-800">
        <div className="absolute right-Space-400 top-Space-1000">
          <ThemeToggle />
        </div>
        {children}
      </div>
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
