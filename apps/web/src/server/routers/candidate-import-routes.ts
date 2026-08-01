import { z } from 'zod'
import { protectedProcedure } from '@/server/trpc'
import { candidateCreateInputSchema } from '@/view-models/candidate-profile.schema'
import type { CandidateDeps } from '@/server/routers/candidate.deps'
import { handleCommitCandidateImport } from '@/server/routers/candidate-duplicate-handlers'

const candidateImportRowsSchema = z.array(candidateCreateInputSchema).max(2000)

export function candidateImportRoutes(deps: CandidateDeps) {
  return {
    commitImport: protectedProcedure
      .input(candidateImportRowsSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await handleCommitCandidateImport(deps, input)
        for (const entityId of result.createdIds) {
          await deps.logLifecycle({
            action: 'created',
            entityType: 'CANDIDATE',
            entityId,
            user: ctx.session.user,
          })
        }
        return result
      }),
  }
}
