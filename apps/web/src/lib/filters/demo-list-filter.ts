import type { DemoListFilters, DemoListRow } from '@/lib/filters/demo-list-types'

export function filterDemoListRows(rows: DemoListRow[], filters: DemoListFilters): DemoListRow[] {
  return rows.filter((row) => {
    if (filters.metier.length && !filters.metier.includes(row.metier)) return false
    if (filters.departement.length && !filters.departement.includes(row.departement)) return false
    if (filters.contrat.length && !filters.contrat.some((value) => row.contrats.includes(value))) return false
    if (filters.incomplete !== null && row.incomplete !== filters.incomplete) return false
    return true
  })
}
