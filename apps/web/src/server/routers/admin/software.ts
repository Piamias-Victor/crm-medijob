import { router, adminProcedure } from '@/server/trpc'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import {
  referentialSchema,
  updateReferentialSchema,
  idSchema,
} from '@/server/admin/schema'

export const softwareRouter = router({
  list: adminProcedure.query(() => softwareRepository.list()),
  create: adminProcedure
    .input(referentialSchema)
    .mutation(({ input }) => softwareRepository.create({ name: input.name })),
  update: adminProcedure
    .input(updateReferentialSchema)
    .mutation(({ input }) =>
      softwareRepository.update(input.id, { name: input.name }),
    ),
  remove: adminProcedure
    .input(idSchema)
    .mutation(({ input }) => softwareRepository.remove(input.id)),
})
