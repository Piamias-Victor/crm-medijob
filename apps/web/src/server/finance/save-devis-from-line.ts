import { TRPCError } from '@trpc/server'
import { toDevisView, type DevisRecord, type DevisView, type DevisWriteFields } from '@/view-models/devis'
import { devisWriteFromLineForm } from '@/lib/finance/devis-from-finance-line'
import type { FinanceLineDevisInput } from '@/view-models/finance-line.schema'

type Deps = {
  findDevis: (id: string) => Promise<DevisRecord | null>
  findDraftByMission: (missionId: string) => Promise<DevisRecord | null>
  createDraft: (data: DevisWriteFields & { missionId: string | null }) => Promise<DevisRecord>
  updateDraft: (id: string, data: DevisWriteFields) => Promise<DevisRecord>
}

export async function saveDevisFromLineForm(
  input: FinanceLineDevisInput,
  deps: Deps,
): Promise<DevisView> {
  const fields = devisWriteFromLineForm(input)
  if (input.devisId) {
    const existing = await deps.findDevis(input.devisId)
    if (!existing || existing.status !== 'DRAFT') {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Aucun brouillon à enregistrer' })
    }
    return toDevisView(await deps.updateDraft(existing.id, fields))
  }
  const existing = input.missionId ? await deps.findDraftByMission(input.missionId) : null
  const devis = existing
    ? await deps.updateDraft(existing.id, fields)
    : await deps.createDraft({ missionId: input.missionId ?? null, ...fields })
  return toDevisView(devis)
}
