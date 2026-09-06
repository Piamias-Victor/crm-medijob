import { parseAmount } from '@/lib/finance/calculate-interim-libre'

/** Empty → null (optional). Invalid/negative → undefined (reject). */
export function parseOptionalProposalAmount(raw: string): number | null | undefined {
  const trimmed = raw.trim().replace(',', '.')
  if (trimmed === '') return null
  const value = parseAmount(trimmed)
  if (value == null || value < 0) return undefined
  return value
}
