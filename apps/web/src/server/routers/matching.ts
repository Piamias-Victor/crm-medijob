import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '@/server/trpc'
import { createAssistantProvider } from '@/server/ai/provider'
import { mapAssistantChatError } from '@/server/ai/router-errors'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { prisma } from '@/server/db/repositories/client'
import { makeBadakanMissionMatchingRepository } from '@/server/db/repositories/badakan-mission-matching.repo'
import { makeCandidateDeclaredMatchingRepository } from '@/server/db/repositories/candidate-declared-matching.repo'
import {
  runMissionMatching,
  type MissionMatchingDeps,
} from '@/server/matching/run-mission-matching'
import {
  runBadakanMissionMatching,
  type BadakanMatchingDeps,
} from '@/server/matching/run-badakan-matching'

const missionIdSchema = z.object({ missionId: z.string().min(1) })

export type MatchingRouterDeps = MissionMatchingDeps & {
  findBadakanMission: BadakanMatchingDeps['findMission']
  listDeclaredCandidates: BadakanMatchingDeps['listCandidates']
}

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
    scoreBadakanMissionCandidates: protectedProcedure
      .input(missionIdSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await runBadakanMissionMatching(input.missionId, {
            findMission: deps.findBadakanMission,
            listCandidates: deps.listDeclaredCandidates,
            listCompatibilities: deps.listCompatibilities,
            provider: deps.provider,
            lookupGeo: deps.lookupGeo,
          })
          if (!result) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Mission Badakan introuvable ou métier non résolu.',
            })
          }
          return result
        } catch (error) {
          throw mapAssistantChatError(error)
        }
      }),
  })
}

const badakanMatching = makeBadakanMissionMatchingRepository(prisma)
const declaredMatching = makeCandidateDeclaredMatchingRepository(prisma)

export const matchingRouter = makeMatchingRouter({
  findMission: (id) => missionRepository.findForMatching(id),
  listCandidates: () => candidateRepository.listForMatching(),
  listCompatibilities: (missionJobTitleId) =>
    jobTitleRepository.listCompatibleCandidateTitles(missionJobTitleId),
  provider: createAssistantProvider(),
  findBadakanMission: (id) => badakanMatching.findForMatching(id),
  listDeclaredCandidates: (range) => declaredMatching.listWithDeclaredSlots(range),
})
