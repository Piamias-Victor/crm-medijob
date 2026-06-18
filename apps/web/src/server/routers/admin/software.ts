import { router, adminProcedure } from '@/server/trpc'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import {
  referentialSchema,
  updateReferentialSchema,
  idSchema,
} from '@/server/admin/schema'

type Ref = { id: string; name: string }

export type SoftwareDeps = {
  list: () => Promise<Ref[]>
  create: (name: string) => Promise<Ref>
  update: (id: string, name: string) => Promise<Ref>
  remove: (id: string) => Promise<unknown>
}

export function makeSoftwareRouter(deps: SoftwareDeps) {
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

export const softwareRouter = makeSoftwareRouter({
  list: () => softwareRepository.list(),
  create: (name) => softwareRepository.create({ name }),
  update: (id, name) => softwareRepository.update(id, { name }),
  remove: (id) => softwareRepository.remove(id),
})
