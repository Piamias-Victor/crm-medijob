import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc'
import { applicationRepository } from '@/server/db/repositories/application.repository'
import { detectApplicationDuplicate } from '@/server/application/intake.adapter'
import { refuseApplication } from '@/server/application/intake'
import type { InboxItem } from '@/view-models/application-inbox'

const idSchema = z.object({ id: z.string().min(1) })

export type ApplicationDeps = {
  listInbox: () => Promise<InboxItem[]>
  detectDuplicate: (applicationId: string) => ReturnType<typeof detectApplicationDuplicate>
  refuse: (id: string) => ReturnType<typeof refuseApplication>
}

export function makeApplicationRouter(deps: ApplicationDeps) {
  return router({
    listInbox: protectedProcedure.query(() => deps.listInbox()),
    detectDuplicate: protectedProcedure.input(idSchema).query(({ input }) => deps.detectDuplicate(input.id)),
    refuse: protectedProcedure.input(idSchema).mutation(({ input }) => deps.refuse(input.id)),
  })
}

export const applicationRouter = makeApplicationRouter({
  listInbox: () => applicationRepository.listInbox(),
  detectDuplicate: detectApplicationDuplicate,
  refuse: (id) =>
    refuseApplication(id, {
      findApplication: applicationRepository.findById,
      markRefused: async (appId) => {
        const updated = await applicationRepository.updateStatus(appId, 'REFUSEE')
        return { id: updated.id, status: updated.status }
      },
    }),
})
