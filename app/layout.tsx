import type React from 'react'
import type { Metadata } from 'next'
import { TRPCProvider } from '@/lib/trpc-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chat AI',
  description: 'A modern chat application with AI integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-sans.antialiased`}>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  )
}