import { router } from '@/server/trpc'
import { healthRouter } from '@/server/routers/health'
import { adminRouter } from '@/server/routers/admin'

export const appRouter = router({
  health: healthRouter,
  admin: adminRouter,
})

export type AppRouter = typeof appRouter
