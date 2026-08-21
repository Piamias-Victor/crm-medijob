import type { DevisKind } from '@/lib/finance/devis-draft'
import { ttcFromHt } from '@/lib/finance/calculate-interim-libre'
import type { DevisWriteFields } from '@/view-models/devis'
import type { FinanceLineKind, FinanceLineRecord } from '@/view-models/finance-line'

export function devisKindFromFinanceLine(kind: FinanceLineKind): DevisKind {
  return kind === 'INTERIM' ? 'INTERIM' : 'CDD'
}

export function devisWriteFromFinanceLine(line: FinanceLineRecord): DevisWriteFields {
  return {
    kind: devisKindFromFinanceLine(line.kind),
    hours: line.hours,
    hourlyRate: line.hourlyRate,
    amountHt: line.amountHt,
    amountTtc: ttcFromHt(line.amountHt),
    htSource: line.htSource,
  }
}
