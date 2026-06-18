import { TRPCError } from '@trpc/server'
import { router, adminProcedure } from '@/server/trpc'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import {
  referentialSchema,
  updateReferentialSchema,
  idSchema,
  compatibilityScoreSchema,
} from '@/server/admin/schema'
import type { CompatibilityPair } from '@/view-models/compatibility-matrix'

type Ref = { id: string; name: string }

export type JobTitleDeps = {
  list: () => Promise<Ref[]>
  listCompatibilities: () => Promise<CompatibilityPair[]>
  create: (name: string) => Promise<Ref>
  update: (id: string, name: string) => Promise<Ref>
  usageCount: (id: string) => Promise<number>
  remove: (id: string) => Promise<unknown>
  setCompatibilityScore: (
    missionJobTitleId: string,
    candidateJobTitleId: string,
    score: number,
  ) => Promise<unknown>
}

export function makeJobTitleRouter(deps: JobTitleDeps) {
  return router({
    list: adminProcedure.query(() => deps.list()),
    compatibilities: adminProcedure.query(() => deps.listCompatibilities()),
    create: adminProcedure
      .input(referentialSchema)
      .mutation(({ input }) => deps.create(input.name)),
    update: adminProcedure
      .input(updateReferentialSchema)
      .mutation(({ input }) => deps.update(input.id, input.name)),
    remove: adminProcedure.input(idSchema).mutation(async ({ input }) => {
      const usage = await deps.usageCount(input.id)
      if (usage > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Métier utilisé par des candidats ou missions.',
        })
      }
      return deps.remove(input.id)
    }),
    setCompatibilityScore: adminProcedure
      .input(compatibilityScoreSchema)
      .mutation(({ input }) =>
        deps.setCompatibilityScore(
          input.missionJobTitleId,
          input.candidateJobTitleId,
          input.score,
        ),
      ),
  })
}

export const jobTitleRouter = makeJobTitleRouter({
  list: () => jobTitleRepository.list(),
  listCompatibilities: () => jobTitleRepository.listCompatibilities(),
  create: (name) => jobTitleRepository.create({ name }),
  update: (id, name) => jobTitleRepository.update(id, { name }),
  usageCount: (id) => jobTitleRepository.usageCount(id),
  remove: (id) => jobTitleRepository.remove(id),
  setCompatibilityScore: (missionJobTitleId, candidateJobTitleId, score) =>
    jobTitleRepository.setCompatibilityScore(
      missionJobTitleId,
      candidateJobTitleId,
      score,
    ),
})
