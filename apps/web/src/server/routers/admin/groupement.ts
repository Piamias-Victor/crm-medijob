import { router, adminProcedure } from '@/server/trpc'
import { groupementRepository } from '@/server/db/repositories/groupement.repository'
import {
  referentialSchema,
  updateReferentialSchema,
  idSchema,
} from '@/server/admin/schema'

type Ref = { id: string; name: string }

export type GroupementDeps = {
  list: () => Promise<Ref[]>
  create: (name: string) => Promise<Ref>
  update: (id: string, name: string) => Promise<Ref>
  remove: (id: string) => Promise<unknown>
}

export function makeGroupementRouter(deps: GroupementDeps) {
  return router({
    list: adminProcedure.query(() => deps.list()),
    create: adminProcedure
      .input(referentialSchema)
      .mutation(({ input }) => deps.create(input.name)),
    update: adminProcedure
      .input(updateReferentialSchema)
      .mutation(({ input }) => deps.update(input.id, input.name)),
    remove: adminProcedure
      .input(idSchema)
      .mutation(({ input }) => deps.remove(input.id)),
  })
}

export const groupementRouter = makeGroupementRouter({
  list: () => groupementRepository.list(),
  create: (name) => groupementRepository.create({ name }),
  update: (id, name) => groupementRepository.update(id, { name }),
  remove: (id) => groupementRepository.remove(id),
})
