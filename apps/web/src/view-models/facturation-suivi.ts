import type { CommercialStatus } from '@/lib/finance/derive-commercial-status'
import type { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import type { DevisRecord } from '@/view-models/devis'
import type { FinanceLineKind } from '@/view-models/finance-line'
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
  missionId: string | null
  financeLineId?: string | null
  candidateName?: string | null
  jobTitle?: string | null
  lineKind?: FinanceLineKind | null
  devisId?: string | null
  devisStatus?: 'DRAFT' | 'SENT' | 'ACCEPTED' | null
  pharmacyId: string
  pharmacyName: string
  referentId: string | null
  referentName: string | null
  contractType: (typeof CONTRACT_TYPES)[number]
  commercialStatus: CommercialStatus
  sentAt: Date | null
  acceptedAt: Date | null
  amountHt: number | null
  marge?: number | null
  cancelled?: boolean
  invoiced?: boolean
  paid?: boolean
}
