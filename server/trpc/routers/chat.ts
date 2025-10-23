import { publicProcedure, router } from '../trpc'
import { z } from 'zod'
import { callLLM } from '@/lib/llm-client'

export const chatRouter = router({
  send: publicProcedure
    .input(z.object({
      message: z.string().min(1, 'Message cannot be empty'),
      model: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      console.log('[Chat Router] Received message:', {
        messageLength: input.message.length,
        model: input.model,
        userId: input.userId,
      })

      try {
        // Call LLM
        const response = await callLLM(input.message, input.model)

        console.log('[Chat Router] LLM response received:', {
          responseLength: response.length,
          model: input.model,
        })

        return {
          id: Math.random().toString(36).substr(2, 9),
          content: response,
          role: 'assistant' as const,
          model: input.model,
          createdAt: new Date(),
        }
      } catch (error) {
        console.error('[Chat Router] Error:', error)
        throw new Error('Failed to generate response. Please try again.')
      }
    }),

  history: publicProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().default(50),
    }))
    .query(async ({ input }) => {
      // Return mock history
      return []
    }),
})