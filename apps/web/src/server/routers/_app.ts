import { router } from '@/server/trpc'
import { healthRouter } from '@/server/routers/health'
import { assistantRouter } from '@/server/routers/assistant'

export const appRouter = router({
  health: healthRouter,
  assistant: assistantRouter,
})

export type AppRouter = typeof appRouter
