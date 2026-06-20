import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '@/server/trpc'
import { createAssistantProvider } from '@/server/ai/provider'
import { mapAssistantChatError } from '@/server/ai/router-errors'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import {
  runMissionMatching,
  type MissionMatchingDeps,
} from '@/server/matching/run-mission-matching'

const missionIdSchema = z.object({ missionId: z.string().min(1) })

export type MatchingRouterDeps = MissionMatchingDeps

export function makeMatchingRouter(deps: MatchingRouterDeps) {
  return router({
    scoreMissionCandidates: protectedProcedure
      .input(missionIdSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await runMissionMatching(input.missionId, deps)
          if (!result) throw new TRPCError({ code: 'NOT_FOUND', message: 'Mission introuvable.' })
          return result
        } catch (error) {
          throw mapAssistantChatError(error)
        }
      }),
  })
}

export const matchingRouter = makeMatchingRouter({
  findMission: (id) => missionRepository.findForMatching(id),
  listCandidates: () => candidateRepository.listForMatching(),
  listCompatibilities: (missionJobTitleId) =>
    jobTitleRepository.listCompatibleCandidateTitles(missionJobTitleId),
  provider: createAssistantProvider(),
})
