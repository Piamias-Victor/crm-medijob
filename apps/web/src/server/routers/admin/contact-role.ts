import { router, adminProcedure } from '@/server/trpc'
import { contactRoleRepository } from '@/server/db/repositories/contact-role.repository'
import {
  referentialSchema,
  updateReferentialSchema,
  idSchema,
} from '@/server/admin/schema'

type Ref = { id: string; name: string }

export type ContactRoleDeps = {
  list: () => Promise<Ref[]>
  create: (name: string) => Promise<Ref>
  update: (id: string, name: string) => Promise<Ref>
  remove: (id: string) => Promise<unknown>
}

export function makeContactRoleRouter(deps: ContactRoleDeps) {
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

export const contactRoleRouter = makeContactRoleRouter({
  list: () => contactRoleRepository.list(),
  create: (name) => contactRoleRepository.create({ name }),
  update: (id, name) => contactRoleRepository.update(id, { name }),
  remove: (id) => contactRoleRepository.remove(id),
})
