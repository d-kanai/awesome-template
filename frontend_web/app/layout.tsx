// import { FeatureFlagProvider } from "@/features/shared/providers/FeatureFlagProvider";
import { QueryProvider } from "@/features/shared/providers/QueryProvider";
import { ThemeProvider } from "@/features/shared/providers/ThemeProvider";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
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
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        <ThemeProvider>
          <QueryProvider>
            {/* <FeatureFlagProvider>{children}</FeatureFlagProvider> */}
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
