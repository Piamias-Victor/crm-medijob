export type ExcelImportKind = 'PLACEMENT' | 'INTERIM'
export type ExcelPlacementType = 'CDD' | 'CDI'

export type ExcelParsedRow = {
  sourceFile: 'suivi' | 'chiffre'
  sheetName: string
  sheetRowNumber: number
  exercice: string
  month: string
  occurredAt: Date
  kind: ExcelImportKind
  placementContractType: ExcelPlacementType | null
  candidateLabel: string
  pharmacyLabel: string
  referentLabel: string
  amountHt: number
  marge: number
  hours: number | null
  invoiced: boolean
  paid: boolean
  zeroCa: boolean
}

export type ExcelParseReport = {
  rows: ExcelParsedRow[]
  ignoredOverlapSuivi: number
  ignoredSheets: string[]
}
