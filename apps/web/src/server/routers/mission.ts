import { z } from 'zod'
import type { MissionStatus } from '@prisma/client'
import { router, protectedProcedure } from '@/server/trpc'
import { toMissionDetail, type MissionDetailEntity } from '@/view-models/mission-detail'
import { toMissionUpdateData } from '@/view-models/mission-update'
import { missionQuickCreateSchema } from '@/view-models/mission-quick-create.schema'
import type { RawMission } from '@/view-models/mission-kanban.types'
import type { LogEntityLifecycle } from '@/server/activity-log/log-entity-lifecycle'
import type { loadMissionReferentials } from '@/server/read-models/mission-referentials'
import {
  idSchema,
  markAnnuleeSchema,
  markPourvuSchema,
  updateMissionSchema,
  updateStatusInput,
  type UpdateMissionStatusInput,
} from '@/server/routers/mission.router.schema'
import { missionListFiltersSchema } from '@/view-models/mission-list-filters.schema'
import type { MissionListFilters } from '@/view-models/mission-list-filters.schema'
import type { MissionQuickViewEntity } from '@/view-models/mission-quick-view.types'
import { toMissionQuickView } from '@/view-models/mission-quick-view'
import type { LeanMapPinRow } from '@/view-models/lean-map-pin-row'
import { missionUpdateMarge } from '@/server/routers/mission-marge'

type Ref = { id: string; name: string }
const nameSchema = z.object({ name: z.string().trim().min(1) })

export type MissionDeps = {
  list: (filters?: MissionListFilters) => Promise<RawMission[]>
  listMapPins: () => Promise<LeanMapPinRow[]>
  findDetailById: (id: string) => Promise<MissionDetailEntity | null>
  findQuickViewById: (id: string) => Promise<MissionQuickViewEntity | null>
  update: (id: string, data: ReturnType<typeof toMissionUpdateData>) => Promise<unknown>
  createQuick: (input: z.output<typeof missionQuickCreateSchema>) => Promise<{ id: string; status: MissionStatus }>
  createJobTitle: (name: string) => Promise<Ref>
  referentials: () => ReturnType<typeof loadMissionReferentials>
  updateStatus: (input: UpdateMissionStatusInput) => Promise<{ id: string; status: UpdateMissionStatusInput['status'] }>
  updateMarge: (id: string, marge: number | null) => Promise<unknown>
  logLifecycle: LogEntityLifecycle
}

export function makeMissionRouter(deps: MissionDeps) {
  return router({
    list: protectedProcedure
      .input(missionListFiltersSchema.optional())
      .query(async ({ input }) => ({ rows: await deps.list(input) })),
    mapPins: protectedProcedure.query(() => deps.listMapPins()),
    getById: protectedProcedure.input(idSchema).query(async ({ input }) => {
      const mission = await deps.findDetailById(input.id)
      return mission ? toMissionDetail(mission) : null
    }),
    quickView: protectedProcedure.input(idSchema).query(async ({ input }) => {
      const row = await deps.findQuickViewById(input.id)
      return row ? toMissionQuickView(row) : null
    }),
    referentials: protectedProcedure.query(() => deps.referentials()),
    create: protectedProcedure
      .input(missionQuickCreateSchema)
      .mutation(async ({ ctx, input }) => {
        const row = await deps.createQuick(input)
        await deps.logLifecycle({
          action: 'created',
          entityType: 'MISSION',
          entityId: row.id,
          user: ctx.session.user,
        })
        return row
      }),
    createJobTitle: protectedProcedure
      .input(nameSchema)
      .mutation(({ input }) => deps.createJobTitle(input.name)),
    update: protectedProcedure.input(updateMissionSchema).mutation(async ({ ctx, input }) => {
      const row = await deps.update(input.id, toMissionUpdateData(input.data))
      await deps.logLifecycle({
        action: 'updated',
        entityType: 'MISSION',
        entityId: input.id,
        user: ctx.session.user,
      })
      return row
    }),
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
    updateMarge: missionUpdateMarge(deps),
  })
}

export type { UpdateMissionStatusInput } from '@/server/routers/mission.router.schema'
