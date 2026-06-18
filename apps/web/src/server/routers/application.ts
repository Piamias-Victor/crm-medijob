import { router, protectedProcedure } from '@/server/trpc'
import { applicationRepository } from '@/server/db/repositories/application.repository'
import type { InboxItem } from '@/view-models/application-inbox'

export type ApplicationDeps = {
  listInbox: () => Promise<InboxItem[]>
}

export function makeApplicationRouter(deps: ApplicationDeps) {
  return router({
    listInbox: protectedProcedure.query(() => deps.listInbox()),
  })
}

export const applicationRouter = makeApplicationRouter({
  listInbox: () => applicationRepository.listInbox(),
})
