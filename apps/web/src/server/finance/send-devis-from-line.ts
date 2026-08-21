import { TRPCError } from '@trpc/server'
import { toDevisView, type DevisRecord, type DevisView, type DevisWriteFields } from '@/view-models/devis'
import { generateDevisFromFinanceLine } from '@/lib/finance/generate-devis-from-line'
import { mapDevisSendError } from '@/server/devis/map-devis-send-error'
import { sendDevis, sendDraftDevis, type SendDevisDeps } from '@/server/devis/send-devis'
import { devisMissionRefFromLine } from '@/view-models/devis-mission-ref-from-line'
import type { DevisPdfDocument } from '@/server/devis/store-devis-pdf'
import type { FinanceLineRecord } from '@/view-models/finance-line'

export type SendDevisFromLineResult = {
  devis: DevisView
  document: DevisPdfDocument
  composeUrl: string
}

export type SendDevisFromLineDeps = SendDevisDeps & {
  findLine: (id: string) => Promise<FinanceLineRecord | null>
  findDevis: (id: string) => Promise<DevisRecord | null>
  createDraft: (data: DevisWriteFields & { missionId: string | null }) => Promise<DevisRecord>
  updateDraft: (id: string, data: DevisWriteFields) => Promise<DevisRecord>
  attachDevis: (lineId: string, devisId: string) => Promise<void>
}

function toSendResult(result: {
  devis: DevisRecord
  document: DevisPdfDocument
  composeUrl: string
}): SendDevisFromLineResult {
  return { devis: toDevisView(result.devis), document: result.document, composeUrl: result.composeUrl }
}

export async function sendDevisFromFinanceLine(
  id: string,
  authorId: string,
  deps: SendDevisFromLineDeps,
): Promise<SendDevisFromLineResult> {
  try {
    let line = await deps.findLine(id)
    if (!line) throw new TRPCError({ code: 'NOT_FOUND', message: 'Ligne introuvable' })
    if (!line.devisId) {
      await generateDevisFromFinanceLine(line, deps)
      line = await deps.findLine(id)
      if (!line?.devisId) throw new TRPCError({ code: 'NOT_FOUND', message: 'Devis introuvable' })
    }
    if (line.missionId) return toSendResult(await sendDevis(line.missionId, authorId, deps))
    const draft = await deps.findDevis(line.devisId)
    if (!draft || draft.status !== 'DRAFT') {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Aucun brouillon à envoyer' })
    }
    return toSendResult(
      await sendDraftDevis(
        draft,
        devisMissionRefFromLine(line),
        authorId,
        deps,
        { entityType: 'PHARMACY', entityId: line.pharmacyId },
        'PHARMACY',
      ),
    )
  } catch (error) {
    if (error instanceof TRPCError) throw error
    throw mapDevisSendError(error)
  }
}
