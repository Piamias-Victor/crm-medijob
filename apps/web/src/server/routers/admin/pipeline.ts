import { TRPCError } from '@trpc/server'
import { router, adminProcedure } from '@/server/trpc'
import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'
import {
  referentialSchema,
  updateReferentialSchema,
  idSchema,
  reorderSchema,
} from '@/server/admin/schema'
import { toPositionUpdates } from '@/server/admin/reorder'

export const pipelineRouter = router({
  list: adminProcedure.query(() => pipelineStageRepository.list()),
  create: adminProcedure.input(referentialSchema).mutation(async ({ input }) => {
    const stages = await pipelineStageRepository.list()
    return pipelineStageRepository.create({
      name: input.name,
      position: stages.length,
    })
  }),
  update: adminProcedure
    .input(updateReferentialSchema)
    .mutation(({ input }) =>
      pipelineStageRepository.update(input.id, { name: input.name }),
    ),
  remove: adminProcedure.input(idSchema).mutation(async ({ input }) => {
    const usage = await pipelineStageRepository.usageCount(input.id)
    if (usage > 0) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Étape utilisée par des candidatures, impossible de la supprimer.',
      })
    }
    return pipelineStageRepository.remove(input.id)
  }),
  reorder: adminProcedure
    .input(reorderSchema)
    .mutation(({ input }) =>
      pipelineStageRepository.reorder(toPositionUpdates(input.orderedIds)),
    ),
})
