import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '@/server/trpc'
import { ttcFromHt } from '@/lib/finance/calculate-interim-libre'
import {
  getDevisByMissionSchema,
  saveDevisDraftSchema,
  type SaveDevisDraftInput,
} from '@/view-models/devis.schema'
import { toDevisView, type DevisRecord, type DevisWriteFields } from '@/view-models/devis'

export type MissionRef = { id: string; contractType: string }

export type DevisDeps = {
  findMission: (id: string) => Promise<MissionRef | null>
  findDraftByMission: (missionId: string) => Promise<DevisRecord | null>
  createDraft: (data: DevisWriteFields & { missionId: string }) => Promise<DevisRecord>
  updateDraft: (id: string, data: DevisWriteFields) => Promise<DevisRecord | null>
}

function writeFields(input: SaveDevisDraftInput): DevisWriteFields {
  return {
    kind: input.kind,
    hours: input.hours,
    hourlyRate: input.hourlyRate,
    amountHt: input.amountHt,
    amountTtc: input.amountHt == null ? null : ttcFromHt(input.amountHt),
    htSource: input.htSource,
  }
}

export function makeDevisRouter(deps: DevisDeps) {
  return router({
    getByMission: protectedProcedure.input(getDevisByMissionSchema).query(async ({ input }) => {
      const row = await deps.findDraftByMission(input.missionId)
      return row ? toDevisView(row) : null
    }),
    save: protectedProcedure.input(saveDevisDraftSchema).mutation(async ({ input }) => {
      if (!(await deps.findMission(input.missionId))) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Mission introuvable' })
      }
      const fields = writeFields(input)
      const existing = await deps.findDraftByMission(input.missionId)
      const row = existing
        ? await deps.updateDraft(existing.id, fields)
        : await deps.createDraft({ missionId: input.missionId, ...fields })
      if (!row) throw new TRPCError({ code: 'NOT_FOUND', message: 'Devis introuvable' })
      return toDevisView(row)
    }),
  })
}
