import { router, adminProcedure } from '@/server/trpc'
import { groupementRepository } from '@/server/db/repositories/groupement.repository'
import {
  referentialSchema,
  updateReferentialSchema,
  idSchema,
} from '@/server/admin/schema'

export const groupementRouter = router({
  list: adminProcedure.query(() => groupementRepository.list()),
  create: adminProcedure
    .input(referentialSchema)
    .mutation(({ input }) => groupementRepository.create({ name: input.name })),
  update: adminProcedure
    .input(updateReferentialSchema)
    .mutation(({ input }) =>
      groupementRepository.update(input.id, { name: input.name }),
    ),
  remove: adminProcedure
    .input(idSchema)
    .mutation(({ input }) => groupementRepository.remove(input.id)),
})
