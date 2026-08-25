import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'
import { REFERENT_NONE, REFERENT_NONE_OPTION } from '@/lib/constants/referent-none'
import { deriveMissionCa } from '@/lib/finance/derive-mission-finance'
import { pickCurrentDevis } from '@/lib/finance/pick-current-devis'
import type { FacturationSliceBucket, FacturationSlices } from '@/view-models/facturation-slice-bucket'
import { facturationMonthKey, facturationMonthLabel } from '@/view-models/facturation-month-key'
import { limitPharmacySlices } from '@/view-models/limit-pharmacy-slices'
import type { FinanceLineRecord } from '@/view-models/finance-line'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'

export type { FacturationSliceBucket, FacturationSlices } from '@/view-models/facturation-slice-bucket'

function addBucket(
  buckets: Map<string, FacturationSliceBucket>,
  key: string,
  label: string,
  ca: number,
  marge: number,
) {
  const prev = buckets.get(key) ?? { key, label, ca: 0, marge: 0 }
  buckets.set(key, { key, label, ca: prev.ca + ca, marge: prev.marge + marge })
}

export function buildFacturationSlices(
  missions: FacturationMissionRecord[],
  lines: FinanceLineRecord[] = [],
): FacturationSlices {
  const byReferent = new Map<string, FacturationSliceBucket>()
  const byPharmacy = new Map<string, FacturationSliceBucket>()
  const byContract = new Map<string, FacturationSliceBucket>()
  const byMonth = new Map<string, FacturationSliceBucket>()
  for (const mission of missions) {
    const current = pickCurrentDevis(mission.devis)
    const ca = deriveMissionCa(mission.status, current)
    if (ca === 0) continue
    const marge = mission.marge ?? 0
    addBucket(
      byReferent,
      mission.referentId ?? REFERENT_NONE,
      mission.referentName ?? REFERENT_NONE_OPTION.label,
      ca,
      marge,
    )
    addBucket(byPharmacy, mission.pharmacyId, mission.pharmacyName, ca, marge)
    addBucket(
      byContract,
      mission.contractType,
      CONTRACT_TYPE_LABELS[mission.contractType],
      ca,
      marge,
    )
    const acceptedAt = current?.acceptedAt
    if (acceptedAt) {
      addBucket(byMonth, facturationMonthKey(acceptedAt), facturationMonthLabel(acceptedAt), ca, marge)
    }
  }
  for (const line of lines) {
    const contractType =
      line.kind === 'INTERIM'
        ? 'INTERIM'
        : line.placementContractType === 'CDI'
          ? 'CDI'
          : 'CDD'
    addBucket(
      byReferent,
      line.referentId ?? REFERENT_NONE,
      line.referentName ?? REFERENT_NONE_OPTION.label,
      line.amountHt,
      line.marge ?? 0,
    )
    addBucket(byPharmacy, line.pharmacyId, line.pharmacyName, line.amountHt, line.marge ?? 0)
    addBucket(byContract, contractType, CONTRACT_TYPE_LABELS[contractType], line.amountHt, line.marge ?? 0)
    addBucket(
      byMonth,
      facturationMonthKey(line.occurredAt),
      facturationMonthLabel(line.occurredAt),
      line.amountHt,
      line.marge ?? 0,
    )
  }
  return {
    byReferent: [...byReferent.values()],
    byPharmacy: limitPharmacySlices([...byPharmacy.values()]),
    byContract: [...byContract.values()],
    byMonth: [...byMonth.values()],
  }
}
