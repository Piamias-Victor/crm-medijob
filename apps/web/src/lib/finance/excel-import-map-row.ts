import type { ExcelImportKind, ExcelParsedRow, ExcelPlacementType } from '@/lib/finance/excel-import-types'
import type { SheetMonth } from '@/lib/finance/excel-import-sheet-month'

function norm(v: unknown): string {
  return String(v ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function cellNum(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  return null
}

function cellBool(v: unknown): boolean {
  return v === true || v === 1 || norm(v) === 'true'
}

function mapType(raw: string): { kind: ExcelImportKind; placement: ExcelPlacementType | null } | null {
  const t = norm(raw).toUpperCase()
  if (t === 'CDD') return { kind: 'PLACEMENT', placement: 'CDD' }
  if (t === 'CDI') return { kind: 'PLACEMENT', placement: 'CDI' }
  if (t.includes('INTERIM')) return { kind: 'INTERIM', placement: null }
  return null
}

export function headerIndex(headers: string[]): Record<string, number> {
  const idx: Record<string, number> = {}
  headers.forEach((h, i) => {
    const key = norm(h)
    if (key.startsWith('candidat') || key === 'c' || key === 'colonne 1') idx.candidate = i
    else if (key.includes('pharmacie')) idx.pharmacy = i
    else if (key.startsWith('type')) idx.type = i
    else if (key.includes('chiffre')) idx.ca = i
    else if (key.includes('marge')) idx.marge = i
    else if (key.includes('heure')) idx.hours = i
    else if (key.includes('recrut')) idx.referent = i
    else if (key.replace(/ /g, '') === 'facture') idx.invoiced = i
    else if (key.includes('encaisse') || key === 'paye') idx.paid = i
  })
  return idx
}

export function mapExcelDataRow(input: {
  cells: unknown[]
  headers: string[]
  sheetRowNumber: number
  sheet: SheetMonth
  sheetName: string
  sourceFile: 'suivi' | 'chiffre'
}): ExcelParsedRow | null {
  const idx = headerIndex(input.headers)
  const candid = norm(input.cells[idx.candidate ?? -1])
  const pharm = norm(input.cells[idx.pharmacy ?? -1])
  if (candid.toUpperCase() === 'TOTAL') return null
  if (!candid && !pharm) return null
  const mapped = mapType(String(input.cells[idx.type ?? -1] ?? ''))
  if (!mapped) return null
  const ca = cellNum(input.cells[idx.ca ?? -1]) ?? 0
  const hoursNum = cellNum(input.cells[idx.hours ?? -1])
  return {
    sourceFile: input.sourceFile,
    sheetName: input.sheetName,
    sheetRowNumber: input.sheetRowNumber,
    exercice: input.sheet.exercice,
    month: input.sheet.monthKey,
    occurredAt: input.sheet.occurredAt,
    kind: mapped.kind,
    placementContractType: mapped.placement,
    candidateLabel: String(input.cells[idx.candidate ?? -1] ?? '').trim(),
    pharmacyLabel: String(input.cells[idx.pharmacy ?? -1] ?? '').trim(),
    referentLabel: String(input.cells[idx.referent ?? -1] ?? '').trim(),
    amountHt: ca,
    marge: cellNum(input.cells[idx.marge ?? -1]) ?? 0,
    hours: mapped.kind === 'INTERIM' && hoursNum != null ? hoursNum : null,
    invoiced: cellBool(input.cells[idx.invoiced ?? -1]),
    paid: cellBool(input.cells[idx.paid ?? -1]),
    zeroCa: ca === 0,
  }
}
