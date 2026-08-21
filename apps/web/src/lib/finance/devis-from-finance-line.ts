import type { DevisKind } from '@/lib/finance/devis-draft'
import { ttcFromHt } from '@/lib/finance/calculate-interim-libre'
import type { DevisWriteFields } from '@/view-models/devis'
import type { FinanceLineKind, FinanceLineRecord } from '@/view-models/finance-line'

export function devisKindFromFinanceLine(kind: FinanceLineKind): DevisKind {
  return kind === 'INTERIM' ? 'INTERIM' : 'CDD'
}

export type DevisLineFormFields = {
  kind: FinanceLineKind
  hours?: number | null
  hourlyRate?: number | null
  amountHt: number
  htSource?: 'ENGINE' | 'TYPED'
}

export function devisWriteFromLineForm(input: DevisLineFormFields): DevisWriteFields {
  return {
    kind: devisKindFromFinanceLine(input.kind),
    hours: input.hours ?? null,
    hourlyRate: input.hourlyRate ?? null,
    amountHt: input.amountHt,
    amountTtc: ttcFromHt(input.amountHt),
    htSource: input.htSource ?? 'TYPED',
  }
}

export function devisWriteFromFinanceLine(line: FinanceLineRecord): DevisWriteFields {
  return devisWriteFromLineForm(line)
}
