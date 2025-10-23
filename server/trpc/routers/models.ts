import { publicProcedure, router } from '../trpc'

export const modelsRouter = router({
  getAvailable: publicProcedure.query(async () => {
    return [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
      { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'OpenAI' }
    ]
  }),
})