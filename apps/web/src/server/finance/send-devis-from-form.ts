import { TRPCError } from '@trpc/server'
import { toDevisView } from '@/view-models/devis'
import { mapDevisSendError } from '@/server/devis/map-devis-send-error'
import { sendDevis, sendDraftDevis, type SendDevisDeps } from '@/server/devis/send-devis'
import { saveDevisFromLineForm } from '@/server/finance/save-devis-from-line'
import { resolveDevisRefFromForm, type ResolveDevisRefDeps } from '@/server/finance/preview-devis-from-line'
import type { DevisRecord, DevisWriteFields } from '@/view-models/devis'
import type { FinanceLineDevisInput } from '@/view-models/finance-line.schema'
import type { SendDevisFromLineResult } from '@/server/finance/send-devis-from-line'

type Deps = SendDevisDeps &
  ResolveDevisRefDeps & {
    findDevis: (id: string) => Promise<DevisRecord | null>
    createDraft: (data: DevisWriteFields & { missionId: string | null }) => Promise<DevisRecord>
    updateDraft: (id: string, data: DevisWriteFields) => Promise<DevisRecord>
  }

export async function sendDevisFromLineForm(
  input: FinanceLineDevisInput,
  authorId: string,
  deps: Deps,
): Promise<SendDevisFromLineResult> {
  try {
    const saved = await saveDevisFromLineForm(input, deps)
    const draft = await deps.findDevis(saved.id)
    if (!draft || draft.status !== 'DRAFT') {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Aucun brouillon à envoyer' })
    }
    if (input.missionId) return toResult(await sendDevis(input.missionId, authorId, deps))
    const mission = await resolveDevisRefFromForm(input, deps)
    return toResult(
      await sendDraftDevis(
        draft,
        mission,
        authorId,
        deps,
        { entityType: 'PHARMACY', entityId: input.pharmacyId },
        'PHARMACY',
      ),
    )
  } catch (error) {
    if (error instanceof TRPCError) throw error
    throw mapDevisSendError(error)
  }
}

function toResult(result: {
  devis: DevisRecord
  document: SendDevisFromLineResult['document']
  composeUrl: string
}): SendDevisFromLineResult {
  return { devis: toDevisView(result.devis), document: result.document, composeUrl: result.composeUrl }
}
