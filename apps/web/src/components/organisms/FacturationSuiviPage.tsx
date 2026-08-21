'use client'

import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { FacturationFilterBar } from '@/components/organisms/facturation-table/facturation-filter-bar'
import { FacturationTable } from '@/components/organisms/facturation-table/facturation-table'
import { FinanceLineDevisAction } from '@/components/molecules/FinanceLineDevisAction'
import { FinanceLineCreateModal } from '@/components/organisms/FinanceLineCreateModal'
import { useFacturationSuiviQuery } from '@/lib/hooks/use-facturation-suivi-query'
import type { FacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { FacturationMissionOption } from '@/view-models/finance-line'

type Ref = { id: string; name: string }

type Props = {
  initialRows: FacturationSuiviRow[]
  serverFilters: FacturationSuiviFilters
  filterConfig: FacturationFilterConfig
  pharmacies: Ref[]
  candidates: Ref[]
  missions: FacturationMissionOption[]
}

export function FacturationSuiviPage({
  initialRows,
  serverFilters,
  filterConfig,
  pharmacies,
  candidates,
  missions,
}: Props) {
  const [open, setOpen] = useState(false)
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
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">{count} ligne(s) — devis et suivi.</p>
        <Button variant="accent" className="shadow-md shadow-accent/20" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Nouvelle ligne
        </Button>
      </div>
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
      <FinanceLineCreateModal
        open={open}
        onClose={() => setOpen(false)}
        pharmacies={pharmacies}
        candidates={candidates}
        missions={missions}
      />
    </div>
  )
}
