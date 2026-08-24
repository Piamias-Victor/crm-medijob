import { createServerCaller } from '@/lib/trpc/server'
import { readFacturationLinesFilters } from '@/lib/filters/read-facturation-lines-filters'
import type { FinanceLineKind } from '@/view-models/finance-line'

export async function loadFacturationLinesPage(
  kind: FinanceLineKind,
  params: Record<string, string | string[] | undefined>,
) {
  const caller = await createServerCaller()
  const refs = await caller.facturation.referentials()
  const { filterConfig, serverFilters } = readFacturationLinesFilters(
    kind,
    params,
    refs.pharmacies,
    refs.recruiters,
  )
  const { rows } = await caller.facturation.listLines(serverFilters)
  return { rows, filterConfig, serverFilters, refs }
}
