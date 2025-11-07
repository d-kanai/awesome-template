import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/features/shared/figma_generated/Card";
import { SignupForm } from "../components/SignupForm";

function ScreenContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background-secondary px-Space-400 py-Space-1200 sm:px-Space-600 lg:px-Space-800">
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
			<CardTitle className="text-center">サインアップ</CardTitle>
		</CardHeader>
	);
}

function Content() {
	return (
		<CardContent>
			<SignupForm />
		</CardContent>
	);
}

export function SignupScreen() {
	return (
		<ScreenContainer>
			<FormCard>
				<Header />
				<Content />
			</FormCard>
		</ScreenContainer>
	);
}
