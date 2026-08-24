import { avgBilledCa, projectNoGo, type NoGoTypeBucket } from '@/view-models/facturation-pilotage-nogo'
import type { PilotageContribution } from '@/view-models/facturation-pilotage-union'

export type PilotageConversionCard = {
  engaged: number
  conversionPct: number
  billedCount: number
  billedCa: number
  lostCount: number
  lostCa: number
}

export type PilotageConversion = {
  cdi: PilotageConversionCard
  cdd: PilotageConversionCard
}

const EMPTY_CARD: PilotageConversionCard = {
  engaged: 0,
  conversionPct: 0,
  billedCount: 0,
  billedCa: 0,
  lostCount: 0,
  lostCa: 0,
}

export const EMPTY_PILOTAGE_CONVERSION: PilotageConversion = {
  cdi: EMPTY_CARD,
  cdd: EMPTY_CARD,
}

function pct(part: number, whole: number) {
  return whole === 0 ? 0 : Math.round((part / whole) * 1000) / 10
}

function toCard(bucket: NoGoTypeBucket): PilotageConversionCard {
  const engaged = bucket.billedCount + bucket.nogoCount
  return {
    engaged,
    conversionPct: pct(bucket.billedCount, engaged),
    billedCount: bucket.billedCount,
    billedCa: bucket.billedCa,
    lostCount: bucket.nogoCount,
    lostCa: avgBilledCa(bucket) * bucket.nogoCount,
  }
}

export function buildPilotageConversion(items: PilotageContribution[]): PilotageConversion {
  const { cdi, cdd } = projectNoGo(items)
  return { cdi: toCard(cdi), cdd: toCard(cdd) }
}
