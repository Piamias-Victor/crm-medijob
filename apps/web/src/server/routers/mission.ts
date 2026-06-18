import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { runMissionStatusTransition } from '@/server/mission/transition-status.adapter'
import type { RawMission } from '@/view-models/mission-kanban.types'

const missionStatuses = [
  'A_POURVOIR',
  'EN_RECHERCHE',
  'CANDIDATS_PRESENTES',
  'ENTRETIEN_EN_COURS',
  'POURVU',
  'ANNULEE',
] as const

const updateStatusInput = z
  .object({
    id: z.string().min(1),
    status: z.enum(missionStatuses),
    placedCandidateId: z.string().min(1).optional(),
  })
  .refine((v) => v.status !== 'POURVU' || v.placedCandidateId, {
    message: 'placedCandidateId required when status is POURVU',
    path: ['placedCandidateId'],
  })

export type UpdateMissionStatusInput = z.infer<typeof updateStatusInput>

export type MissionDeps = {
  list: () => Promise<RawMission[]>
  updateStatus: (input: UpdateMissionStatusInput) => Promise<{ id: string; status: UpdateMissionStatusInput['status'] }>
}

export function makeMissionRouter(deps: MissionDeps) {
  return router({
    list: protectedProcedure.query(() => deps.list()),
    updateStatus: protectedProcedure
      .input(updateStatusInput)
      .mutation(({ input }) => deps.updateStatus(input)),
  })
}

export const missionRouter = makeMissionRouter({
  list: () => missionRepository.list(),
  updateStatus: (input) =>
    runMissionStatusTransition({
      missionId: input.id,
      status: input.status,
      placedCandidateId: input.placedCandidateId,
    }),
})
