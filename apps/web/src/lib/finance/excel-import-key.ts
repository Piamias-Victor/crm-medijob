import { createHash } from 'node:crypto'
import { normalizeImportLabel } from '@/lib/finance/excel-import-normalize'

export function buildImportKey(input: {
  exercice: string
  month: string
  sheetRowNumber: number
  pharmacyLabel: string
  candidateLabel: string
}): string {
  const payload = [
    input.exercice,
    input.month,
    String(input.sheetRowNumber),
    normalizeImportLabel(input.pharmacyLabel),
    normalizeImportLabel(input.candidateLabel),
  ].join('|')
  return createHash('sha256').update(payload).digest('hex')
}
