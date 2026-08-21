export const FINANCE_LINE_KINDS = ['PLACEMENT', 'INTERIM'] as const

export type FinanceLineKind = (typeof FINANCE_LINE_KINDS)[number]

export type FinanceLineRecord = {
  id: string
  kind: FinanceLineKind
  pharmacyId: string
  pharmacyName: string
  candidateId: string
  candidateName: string
  missionId: string | null
  devisId: string | null
  amountHt: number
  marge: number | null
  occurredAt: Date
}

export type FacturationMissionOption = { id: string; title: string; pharmacyId: string }
