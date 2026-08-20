import type { MissionStatus } from '@prisma/client'
import type { DevisStatus } from '@/view-models/devis'

type CurrentQuote = {
  status: DevisStatus
  amountHt: number | null
}

export function deriveMissionCa(
  missionStatus: MissionStatus,
  current: CurrentQuote | null,
): number {
  if (missionStatus === 'ANNULEE') return 0
  if (current?.status !== 'ACCEPTED') return 0
  return current.amountHt ?? 0
}
