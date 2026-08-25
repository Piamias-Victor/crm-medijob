'use client'

import { useState } from 'react'
import { FacturationFilterBar } from '@/components/organisms/facturation-table/facturation-filter-bar'
import { FacturationTable } from '@/components/organisms/facturation-table/facturation-table'
import { FacturationLinesHeader } from '@/components/organisms/FacturationLinesHeader'
import { FinanceLineRowActions } from '@/components/molecules/FinanceLineRowActions'
import { FinanceLineCreateModal } from '@/components/organisms/FinanceLineCreateModal'
import { useFacturationLinesQuery } from '@/lib/hooks/use-facturation-lines-query'
import type { FacturationLinesFilterConfig } from '@/lib/filters/facturation-lines-filter-config'
import type { FacturationLineListFiltersInput } from '@/view-models/facturation-line-filters.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { FacturationMissionOption, FinanceLineKind } from '@/view-models/finance-line'

type Ref = { id: string; name: string }

type Props = {
  kind: FinanceLineKind
  createLabel: string
  createTitle: string
  csvFilename: string
  initialRows: FacturationSuiviRow[]
  serverFilters: FacturationLineListFiltersInput
  filterConfig: FacturationLinesFilterConfig
  pharmacies: Ref[]
  candidates: Ref[]
  missions: FacturationMissionOption[]
  recruiters: Ref[]
}

export function FacturationLinesPage({
  kind,
  createLabel,
  createTitle,
  csvFilename,
  initialRows,
  serverFilters,
  filterConfig,
  pharmacies,
  candidates,
  missions,
  recruiters,
}: Props) {
  const [open, setOpen] = useState(false)
  const { values, setFilters, reset, rows } = useFacturationLinesQuery(
    kind,
    initialRows,
    serverFilters,
    filterConfig,
  )
  return (
    <div className="space-y-4">
      <FacturationLinesHeader
        rows={rows}
        csvFilename={csvFilename}
        createLabel={createLabel}
        onCreate={() => setOpen(true)}
      />
      <FacturationFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={setFilters}
        onReset={reset}
      />
      <FacturationTable rows={rows} renderActions={(row) => <FinanceLineRowActions row={row} />} />
      <FinanceLineCreateModal
        open={open}
        onClose={() => setOpen(false)}
        title={createTitle}
        defaultKind={kind}
        pharmacies={pharmacies}
        candidates={candidates}
        missions={missions}
        recruiters={recruiters}
      />
    </div>
  )
}
