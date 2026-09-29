import { TRPCError } from '@trpc/server'
import { toDevisView, type DevisRecord, type DevisWriteFields, type DevisView } from '@/view-models/devis'
import { devisWriteFromFinanceLine } from '@/lib/finance/devis-from-finance-line'
import { requireLinkedFinanceLine } from '@/lib/finance/require-linked-finance-line'
import { FINANCE_LINE_DEVIS_EXISTS } from '@/view-models/finance-line-copy'
import type { FinanceLineRecord } from '@/view-models/finance-line'

export type GenerateDevisFromLineResult = {
  pharmacyId: string
  missionId: string | null
  devis: DevisView
}

type Deps = {
  findDraftByMission: (missionId: string) => Promise<DevisRecord | null>
  createDraft: (data: DevisWriteFields & { missionId: string | null }) => Promise<DevisRecord>
  updateDraft: (id: string, data: DevisWriteFields) => Promise<DevisRecord>
  attachDevis: (lineId: string, devisId: string) => Promise<void>
}

export async function generateDevisFromFinanceLine(
  line: FinanceLineRecord,
  deps: Deps,
): Promise<GenerateDevisFromLineResult> {
  const linked = requireLinkedFinanceLine(line)
  if (linked.devisId) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: FINANCE_LINE_DEVIS_EXISTS })
  }
  const fields = devisWriteFromFinanceLine(linked)
  const existing = linked.missionId ? await deps.findDraftByMission(linked.missionId) : null
  const devis = existing
    ? await deps.updateDraft(existing.id, fields)
    : await deps.createDraft({ missionId: linked.missionId, ...fields })
  await deps.attachDevis(linked.id, devis.id)
  return { pharmacyId: linked.pharmacyId, missionId: linked.missionId, devis: toDevisView(devis) }
}
