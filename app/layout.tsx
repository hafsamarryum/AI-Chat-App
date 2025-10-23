// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { TRPCProvider } from "@/lib/trpc-provider";
import ThemeProvider from "./ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat AI",
  description: "A modern chat application with AI integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="font-sans antialiased transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <TRPCProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}