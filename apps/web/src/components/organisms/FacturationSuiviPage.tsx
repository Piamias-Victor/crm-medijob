'use client'

import { useCallback, useState } from 'react'
import { FacturationFilterBar } from '@/components/organisms/facturation-table/facturation-filter-bar'
import { FacturationTable } from '@/components/organisms/facturation-table/facturation-table'
import { FinanceLineDevisAction } from '@/components/molecules/FinanceLineDevisAction'
import { useFacturationSuiviQuery } from '@/lib/hooks/use-facturation-suivi-query'
import type { FacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = {
  initialRows: FacturationSuiviRow[]
  serverFilters: FacturationSuiviFilters
  filterConfig: FacturationFilterConfig
}

export function FacturationSuiviPage({ initialRows, serverFilters, filterConfig }: Props) {
  const [count, setCount] = useState(initialRows.length)
  const onCountChange = useCallback((next: number) => setCount(next), [])
  const { values, setFilters, reset, rows } = useFacturationSuiviQuery(
    initialRows,
    serverFilters,
    filterConfig,
    onCountChange,
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-fg-muted">{count} ligne(s) — devis et suivi.</p>
      <FacturationFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={setFilters}
        onReset={reset}
      />
      <FacturationTable
        rows={rows}
        renderActions={(row) => <FinanceLineDevisAction row={row} />}
      />
    </div>
  )
}
