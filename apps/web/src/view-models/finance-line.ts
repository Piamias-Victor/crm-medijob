export const FINANCE_LINE_KINDS = ['PLACEMENT', 'INTERIM'] as const
export const PLACEMENT_CONTRACT_TYPES = ['CDD', 'CDI'] as const

export type FinanceLineKind = (typeof FINANCE_LINE_KINDS)[number]
export type PlacementContractType = (typeof PLACEMENT_CONTRACT_TYPES)[number]

export type FinanceLineRecord = {
  id: string
  kind: FinanceLineKind
  pharmacyId: string
  pharmacyName: string
  candidateId: string
  candidateName: string
  missionId: string | null
  devisId: string | null
  hours: number | null
  hourlyRate: number | null
  amountHt: number
  htSource: 'ENGINE' | 'TYPED'
  marge: number | null
  occurredAt: Date
  devisStatus: 'DRAFT' | 'SENT' | 'ACCEPTED' | null
  referentId: string | null
  referentName: string | null
  placementContractType: PlacementContractType | null
  cancelled: boolean
  invoiced: boolean
  paid: boolean
}

export type FacturationMissionOption = {
  id: string
  title: string
  pharmacyId: string
  contractType: 'CDI' | 'CDD' | 'INTERIM' | 'VACATION'
}
