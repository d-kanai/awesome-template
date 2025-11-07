import { FeatureFlagProvider } from "@/features/shared/providers/FeatureFlagProvider";
import { QueryProvider } from "@/features/shared/providers/QueryProvider";
import { ThemeProvider } from "@/features/shared/providers/ThemeProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Awesome Template Web",
	description: "Frontend web application for awesome-template",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<body>
				<ThemeProvider>
					<QueryProvider>
						<FeatureFlagProvider>{children}</FeatureFlagProvider>
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
