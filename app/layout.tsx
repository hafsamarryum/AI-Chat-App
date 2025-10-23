// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { TRPCProvider } from "@/lib/trpc-provider";
import { ThemeProvider } from "@/app/context/ThemeProvider";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const active = theme || (prefersDark ? 'dark' : 'light');
                  if (active === 'dark') document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased transition-colors duration-300">
        <TRPCProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
