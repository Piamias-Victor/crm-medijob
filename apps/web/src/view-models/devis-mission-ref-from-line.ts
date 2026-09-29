import type { FinanceLineRecord } from '@/view-models/finance-line'
import type { DevisMissionRef } from '@/view-models/devis-mission-ref'
import { requireLinkedFinanceLine } from '@/lib/finance/require-linked-finance-line'

export function devisMissionRefFromLine(line: FinanceLineRecord): DevisMissionRef {
  const linked = requireLinkedFinanceLine(line)
  return devisMissionRefFromPharmacy({
    pharmacyId: linked.pharmacyId,
    pharmacyName: linked.pharmacyName,
    candidateName: linked.candidateName,
    missionId: linked.missionId,
  })
}

export function devisMissionRefFromPharmacy(input: {
  pharmacyId: string
  pharmacyName: string
  candidateName: string
  missionId?: string | null
}): DevisMissionRef {
  return {
    id: input.missionId ?? input.pharmacyId,
    title: input.candidateName,
    pharmacyId: input.pharmacyId,
    pharmacyName: input.pharmacyName,
    contact: null,
  }
}
