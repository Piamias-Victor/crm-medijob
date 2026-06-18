import { router } from '@/server/trpc'
import { healthRouter } from '@/server/routers/health'
import { pharmacyRouter } from '@/server/routers/pharmacy'

export const appRouter = router({
  health: healthRouter,
  pharmacy: pharmacyRouter,
})

export type AppRouter = typeof appRouter
