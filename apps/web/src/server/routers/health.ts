import { router, publicProcedure } from '@/server/trpc'

export const healthRouter = router({
  check: publicProcedure.query(() => ({ status: 'ok' as const })),
})
