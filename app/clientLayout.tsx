// app/clientLayout.tsx
"use client";

import { TRPCProvider } from "@/lib/trpc-provider";
import ThemeProvider from "./ThemeProvider";

// ✅ Client-side wrapper for Theme + Providers
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
  return (
    <TRPCProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </TRPCProvider>
  );
}