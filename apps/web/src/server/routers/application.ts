import { router, protectedProcedure } from '@/server/trpc'
import { applicationRepository } from '@/server/db/repositories/application.repository'

export const applicationRouter = router({
  listInbox: protectedProcedure.query(() => applicationRepository.listInbox()),
})
