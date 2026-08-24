import type { PlacementContractType } from '@/view-models/finance-line'
import type { PilotageContribution } from '@/view-models/facturation-pilotage-union'

export function isNoGo(item: PilotageContribution): boolean {
  if (item.pole !== 'placement') return false
  return item.cancelled || (item.ca === 0 && item.marge === 0)
}

export type NoGoTypeBucket = { billedCa: number; billedCount: number; nogoCount: number }

function emptyBucket(): NoGoTypeBucket {
  return { billedCa: 0, billedCount: 0, nogoCount: 0 }
}

export function avgBilledCa(bucket: NoGoTypeBucket) {
  return bucket.billedCount === 0 ? 0 : bucket.billedCa / bucket.billedCount
}

export function projectNoGo(items: PilotageContribution[]) {
  const byType: Record<PlacementContractType, NoGoTypeBucket> = {
    CDD: emptyBucket(),
    CDI: emptyBucket(),
  }
  let billedCa = 0
  let nogoCount = 0
  for (const item of items) {
    if (item.pole !== 'placement') continue
    const bucket = item.placementType ? byType[item.placementType] : null
    if (isNoGo(item)) {
      nogoCount += 1
      if (bucket) bucket.nogoCount += 1
      continue
    }
    billedCa += item.ca
    if (bucket) {
      bucket.billedCa += item.ca
      bucket.billedCount += 1
    }
  }
  return {
    billedCa,
    nogoCount,
    lostCa: avgBilledCa(byType.CDD) * byType.CDD.nogoCount + avgBilledCa(byType.CDI) * byType.CDI.nogoCount,
    cdd: byType.CDD,
    cdi: byType.CDI,
  }
}
