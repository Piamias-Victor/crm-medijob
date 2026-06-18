import { TRPCError } from '@trpc/server'
import { router, adminProcedure } from '@/server/trpc'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import {
  referentialSchema,
  updateReferentialSchema,
  idSchema,
  compatibilityScoreSchema,
} from '@/server/admin/schema'

export const jobTitleRouter = router({
  list: adminProcedure.query(() => jobTitleRepository.list()),
  compatibilities: adminProcedure.query(() =>
    jobTitleRepository.listCompatibilities(),
  ),
  create: adminProcedure
    .input(referentialSchema)
    .mutation(({ input }) => jobTitleRepository.create({ name: input.name })),
  update: adminProcedure
    .input(updateReferentialSchema)
    .mutation(({ input }) =>
      jobTitleRepository.update(input.id, { name: input.name }),
    ),
  remove: adminProcedure.input(idSchema).mutation(async ({ input }) => {
    const usage = await jobTitleRepository.usageCount(input.id)
    if (usage > 0) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Métier utilisé par des candidats ou missions.',
      })
    }
    return jobTitleRepository.remove(input.id)
  }),
  setCompatibilityScore: adminProcedure
    .input(compatibilityScoreSchema)
    .mutation(({ input }) =>
      jobTitleRepository.setCompatibilityScore(
        input.missionJobTitleId,
        input.candidateJobTitleId,
        input.score,
      ),
    ),
})
