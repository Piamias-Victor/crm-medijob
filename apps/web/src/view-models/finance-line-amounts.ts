import { parseAmount } from '@/lib/finance/calculate-interim-libre'
import { applyLinkedAmounts, type HtSource, type LinkedField } from '@/lib/finance/devis-draft'

export type FinanceLineAmountValues = {
  hours: string
  hourlyRate: string
  amountHt: string
  htSource: HtSource
}

function toNum(value: string): number | null {
  return parseAmount(value === '' ? null : value)
}

function toStr(value: number | null): string {
  return value == null ? '' : String(value)
}

export function linkFinanceLineAmounts(
  values: FinanceLineAmountValues,
  changed: LinkedField,
): FinanceLineAmountValues {
  const next = applyLinkedAmounts(
    {
      kind: 'INTERIM',
      hours: toNum(values.hours),
      hourlyRate: toNum(values.hourlyRate),
      amountHt: toNum(values.amountHt),
      amountTtc: null,
      htSource: values.htSource,
    },
    changed,
  )
  return {
    hours: changed === 'hours' ? values.hours : toStr(next.hours),
    hourlyRate: changed === 'hourlyRate' ? values.hourlyRate : toStr(next.hourlyRate),
    amountHt: changed === 'amountHt' ? values.amountHt : toStr(next.amountHt),
    htSource: next.htSource,
  }
}
