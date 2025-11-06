import { FeatureFlagProvider } from "@/features/shared/providers/FeatureFlagProvider";
import { QueryProvider } from "@/features/shared/providers/QueryProvider";
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
    <html lang="ja">
      <body>
        <QueryProvider>
          <FeatureFlagProvider>{children}</FeatureFlagProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
