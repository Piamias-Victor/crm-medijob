import type { MissionStatus } from '@prisma/client'
import type { DevisView } from '@/view-models/devis'
import { deriveCommercialStatus } from '@/lib/finance/derive-commercial-status'
import { deriveMissionCa } from '@/lib/finance/derive-mission-finance'

export type MissionQuoteState = ReturnType<typeof toMissionQuoteState>

export function toMissionQuoteState(missionStatus: MissionStatus, current: DevisView | null) {
  return {
    commercialStatus: deriveCommercialStatus(current),
    ca: deriveMissionCa(missionStatus, current),
    canAccept: current?.status === 'SENT',
    canInvoice: current?.status === 'ACCEPTED',
  }
}
