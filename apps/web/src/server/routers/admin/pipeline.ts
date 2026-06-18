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

type Stage = { id: string; name: string; position: number }

export type PipelineDeps = {
  list: () => Promise<Stage[]>
  create: (name: string, position: number) => Promise<Stage>
  update: (id: string, name: string) => Promise<Stage>
  usageCount: (id: string) => Promise<number>
  remove: (id: string) => Promise<unknown>
  reorder: (orderedIds: string[]) => Promise<unknown>
}

export function makePipelineRouter(deps: PipelineDeps) {
  return router({
    list: adminProcedure.query(() => deps.list()),
    create: adminProcedure.input(referentialSchema).mutation(async ({ input }) => {
      const stages = await deps.list()
      return deps.create(input.name, stages.length)
    }),
    update: adminProcedure
      .input(updateReferentialSchema)
      .mutation(({ input }) => deps.update(input.id, input.name)),
    remove: adminProcedure.input(idSchema).mutation(async ({ input }) => {
      const usage = await deps.usageCount(input.id)
      if (usage > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Étape utilisée par des candidatures, impossible de la supprimer.',
        })
      }
      return deps.remove(input.id)
    }),
    reorder: adminProcedure
      .input(reorderSchema)
      .mutation(({ input }) => deps.reorder(input.orderedIds)),
  })
}

export const pipelineRouter = makePipelineRouter({
  list: () => pipelineStageRepository.list(),
  create: (name, position) => pipelineStageRepository.create({ name, position }),
  update: (id, name) => pipelineStageRepository.update(id, { name }),
  usageCount: (id) => pipelineStageRepository.usageCount(id),
  remove: (id) => pipelineStageRepository.remove(id),
  reorder: (orderedIds) =>
    pipelineStageRepository.reorder(toPositionUpdates(orderedIds)),
})
