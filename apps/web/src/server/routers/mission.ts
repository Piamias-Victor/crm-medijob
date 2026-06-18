import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import type { RawMission } from '@/view-models/mission-kanban.types'

const updateStatusInput = z.object({
  id: z.string().min(1),
  status: z.enum([
    'A_POURVOIR',
    'EN_RECHERCHE',
    'CANDIDATS_PRESENTES',
    'ENTRETIEN_EN_COURS',
    'POURVU',
    'ANNULEE',
  ]),
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
  updateStatus: (input) => missionRepository.updateStatus(input.id, input.status),
})
