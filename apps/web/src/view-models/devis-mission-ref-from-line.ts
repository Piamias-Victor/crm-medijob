import type { FinanceLineRecord } from '@/view-models/finance-line'
import type { DevisMissionRef } from '@/view-models/devis-mission-ref'

export function devisMissionRefFromLine(line: FinanceLineRecord): DevisMissionRef {
  return devisMissionRefFromPharmacy({
    pharmacyId: line.pharmacyId,
    pharmacyName: line.pharmacyName,
    candidateName: line.candidateName,
    missionId: line.missionId,
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
