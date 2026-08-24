import { facturationMonthKey, facturationMonthLabel } from '@/view-models/facturation-month-key'

export function facturationMonthFilterOptions(now = new Date(), count = 24) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - index, 1))
    return { value: facturationMonthKey(date), label: facturationMonthLabel(date) }
  })
}
