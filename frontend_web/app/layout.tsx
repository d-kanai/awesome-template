import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { getNonce } from "@/shared/lib/csp";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { ErrorBoundary } from "@/shared/ui/components/ErrorBoundary/ErrorBoundary";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Awesome Template Web",
  description: "Frontend web application for awesome-template",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = await getNonce();

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        <ThemeProvider nonce={nonce}>
          <QueryProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
