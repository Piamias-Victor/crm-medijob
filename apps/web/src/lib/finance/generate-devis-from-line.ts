import { TRPCError } from '@trpc/server'
import { toDevisView, type DevisRecord, type DevisWriteFields, type DevisView } from '@/view-models/devis'
import { devisWriteFromFinanceLine } from '@/lib/finance/devis-from-finance-line'
import {
  FINANCE_LINE_DEVIS_EXISTS,
  FINANCE_LINE_MISSION_REQUIRED,
} from '@/view-models/finance-line-copy'
import type { FinanceLineRecord } from '@/view-models/finance-line'

export type GenerateDevisFromLineResult = {
  pharmacyId: string
  missionId: string
  devis: DevisView
}

type Deps = {
  findDraftByMission: (missionId: string) => Promise<DevisRecord | null>
  createDraft: (data: DevisWriteFields & { missionId: string }) => Promise<DevisRecord>
  updateDraft: (id: string, data: DevisWriteFields) => Promise<DevisRecord>
  attachDevis: (lineId: string, devisId: string) => Promise<void>
}

export async function generateDevisFromFinanceLine(
  line: FinanceLineRecord,
  deps: Deps,
): Promise<GenerateDevisFromLineResult> {
  if (!line.missionId) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: FINANCE_LINE_MISSION_REQUIRED })
  }
  if (line.devisId) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: FINANCE_LINE_DEVIS_EXISTS })
  }
  const fields = devisWriteFromFinanceLine(line)
  const existing = await deps.findDraftByMission(line.missionId)
  const devis = existing
    ? await deps.updateDraft(existing.id, fields)
    : await deps.createDraft({ missionId: line.missionId, ...fields })
  await deps.attachDevis(line.id, devis.id)
  return { pharmacyId: line.pharmacyId, missionId: line.missionId, devis: toDevisView(devis) }
}
