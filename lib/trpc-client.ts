'use client'

import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@/server/trpc/root'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // Must match your /api/trpc route
      url: typeof window !== 'undefined' 
        ? '/api/trpc'
        : process.env.NEXT_PUBLIC_API_URL + '/api/trpc',
    }),
  ],
})
