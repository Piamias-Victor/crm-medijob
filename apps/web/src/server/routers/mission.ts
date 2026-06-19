import { z } from 'zod'
import type { MissionStatus } from '@prisma/client'
import { router, protectedProcedure } from '@/server/trpc'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { runMissionStatusTransition } from '@/server/mission/transition-status.adapter'
import { fetchMissionReferentials } from '@/server/read-models/mission-referentials.adapter'
import { toMissionDetail, type MissionDetailEntity } from '@/view-models/mission-detail'
import { toMissionUpdateData } from '@/view-models/mission-update'
import { missionQuickCreateSchema } from '@/view-models/mission-quick-create.schema'
import type { RawMission } from '@/view-models/mission-kanban.types'
import {
  idSchema,
  markAnnuleeSchema,
  markPourvuSchema,
  updateMissionSchema,
  updateStatusInput,
  type UpdateMissionStatusInput,
} from '@/server/routers/mission.router.schema'

type Ref = { id: string; name: string }
const nameSchema = z.object({ name: z.string().trim().min(1) })

export type MissionDeps = {
  list: () => Promise<RawMission[]>
  findDetailById: (id: string) => Promise<MissionDetailEntity | null>
  update: (id: string, data: ReturnType<typeof toMissionUpdateData>) => Promise<unknown>
  createQuick: (input: z.output<typeof missionQuickCreateSchema>) => Promise<{ id: string; status: MissionStatus }>
  createJobTitle: (name: string) => Promise<Ref>
  referentials: () => ReturnType<typeof fetchMissionReferentials>
  updateStatus: (input: UpdateMissionStatusInput) => Promise<{ id: string; status: UpdateMissionStatusInput['status'] }>
}

export function makeMissionRouter(deps: MissionDeps) {
  return router({
    list: protectedProcedure.query(() => deps.list()),
    getById: protectedProcedure.input(idSchema).query(async ({ input }) => {
      const mission = await deps.findDetailById(input.id)
      return mission ? toMissionDetail(mission) : null
    }),
    referentials: protectedProcedure.query(() => deps.referentials()),
    /** Quick-create from pharmacy fiche — delegates to missionRepository.createQuick. */
    create: protectedProcedure
      .input(missionQuickCreateSchema)
      .mutation(({ input }) => deps.createQuick(input)),
    createJobTitle: protectedProcedure
      .input(nameSchema)
      .mutation(({ input }) => deps.createJobTitle(input.name)),
    update: protectedProcedure
      .input(updateMissionSchema)
      .mutation(({ input }) => deps.update(input.id, toMissionUpdateData(input.data))),
    markPourvu: protectedProcedure
      .input(markPourvuSchema)
      .mutation(({ input }) =>
        deps.updateStatus({ id: input.id, status: 'POURVU', placedCandidateId: input.placedCandidateId }),
      ),
    markAnnulee: protectedProcedure
      .input(markAnnuleeSchema)
      .mutation(({ input }) => deps.updateStatus({ id: input.id, status: 'ANNULEE' })),
    updateStatus: protectedProcedure
      .input(updateStatusInput)
      .mutation(({ input }) => deps.updateStatus(input)),
  })
}

export const missionRouter = makeMissionRouter({
  list: () => missionRepository.list(),
  findDetailById: (id) => missionRepository.findDetailById(id),
  update: (id, data) => missionRepository.update(id, data),
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

export type { UpdateMissionStatusInput } from '@/server/routers/mission.router.schema'
