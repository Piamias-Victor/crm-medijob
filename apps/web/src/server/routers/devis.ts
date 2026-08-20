import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '@/server/trpc'
import { ttcFromHt } from '@/lib/finance/calculate-interim-libre'
import { sendDevis, SendDevisError, type SendDevisDeps } from '@/server/devis/send-devis'
import {
  getDevisByMissionSchema,
  saveDevisDraftSchema,
  sendDevisSchema,
  deleteDevisDraftSchema,
  type SaveDevisDraftInput,
} from '@/view-models/devis.schema'
import { toDevisView, toDevisMissionView, type DevisRecord, type DevisWriteFields } from '@/view-models/devis'

export type DevisDeps = SendDevisDeps & {
  createDraft: (data: DevisWriteFields & { missionId: string }) => Promise<DevisRecord>
  updateDraft: (id: string, data: DevisWriteFields) => Promise<DevisRecord | null>
  listByMission: (missionId: string) => Promise<DevisRecord[]>
  softDeleteDraft: (id: string) => Promise<DevisRecord | null>
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
    getByMission: protectedProcedure.input(getDevisByMissionSchema).query(async ({ input }) =>
      toDevisMissionView(await deps.listByMission(input.missionId)),
    ),
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
    send: protectedProcedure.input(sendDevisSchema).mutation(async ({ ctx, input }) => {
      try {
        const result = await sendDevis(input.missionId, ctx.session.user.id, deps)
        return {
          devis: toDevisView(result.devis),
          document: result.document,
          composeUrl: result.composeUrl,
        }
      } catch (error) {
        if (error instanceof SendDevisError) {
          throw new TRPCError({ code: error.code, message: error.message })
        }
        throw error
      }
    }),
    deleteDraft: protectedProcedure.input(deleteDevisDraftSchema).mutation(async ({ input }) => {
      const draft = await deps.findDraftByMission(input.missionId)
      if (!draft) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Aucun brouillon à supprimer' })
      const deleted = await deps.softDeleteDraft(draft.id)
      if (!deleted) throw new TRPCError({ code: 'NOT_FOUND', message: 'Devis introuvable' })
      return { id: deleted.id }
    }),
  })
}
