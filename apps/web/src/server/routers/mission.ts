import { z } from 'zod'
import type { MissionStatus } from '@prisma/client'
import { router, protectedProcedure } from '@/server/trpc'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { runMissionStatusTransition } from '@/server/mission/transition-status.adapter'
import { fetchMissionReferentials } from '@/server/read-models/mission-referentials.adapter'
import { missionQuickCreateSchema } from '@/view-models/mission-quick-create.schema'
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

type Ref = { id: string; name: string }
const nameSchema = z.object({ name: z.string().trim().min(1) })

export type MissionDeps = {
  list: () => Promise<RawMission[]>
  createQuick: (input: z.output<typeof missionQuickCreateSchema>) => Promise<{ id: string; status: MissionStatus }>
  createJobTitle: (name: string) => Promise<Ref>
  referentials: () => ReturnType<typeof fetchMissionReferentials>
  updateStatus: (input: UpdateMissionStatusInput) => Promise<{ id: string; status: UpdateMissionStatusInput['status'] }>
}

export function makeMissionRouter(deps: MissionDeps) {
  return router({
    list: protectedProcedure.query(() => deps.list()),
    referentials: protectedProcedure.query(() => deps.referentials()),
    create: protectedProcedure
      .input(missionQuickCreateSchema)
      .mutation(({ input }) => deps.createQuick(input)),
    createJobTitle: protectedProcedure
      .input(nameSchema)
      .mutation(({ input }) => deps.createJobTitle(input.name)),
    updateStatus: protectedProcedure
      .input(updateStatusInput)
      .mutation(({ input }) => deps.updateStatus(input)),
  })
}

export const missionRouter = makeMissionRouter({
  list: () => missionRepository.list(),
  createQuick: (input) =>
    missionRepository.createQuick({ ...input, startDate: input.startDate ?? new Date() }),
  createJobTitle: (name) => jobTitleRepository.create({ name }),
  referentials: fetchMissionReferentials,
  updateStatus: (input) =>
    runMissionStatusTransition({
      missionId: input.id,
      status: input.status,
      placedCandidateId: input.placedCandidateId,
    }),
})
