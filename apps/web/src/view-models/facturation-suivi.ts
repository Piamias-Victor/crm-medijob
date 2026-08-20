import type { CommercialStatus } from '@/lib/finance/derive-commercial-status'
import type { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import type { DevisRecord } from '@/view-models/devis'
import type { MissionStatus } from '@prisma/client'

export type FacturationMissionRecord = {
  id: string
  pharmacyId: string
  pharmacyName: string
  referentId: string | null
  referentName: string | null
  contractType: (typeof CONTRACT_TYPES)[number]
  status: MissionStatus
  marge: number | null
  devis: DevisRecord[]
}

export type FacturationSuiviRow = {
  missionId: string
  pharmacyId: string
  pharmacyName: string
  referentId: string | null
  referentName: string | null
  contractType: (typeof CONTRACT_TYPES)[number]
  commercialStatus: CommercialStatus
  sentAt: Date | null
  acceptedAt: Date | null
  amountHt: number | null
}
