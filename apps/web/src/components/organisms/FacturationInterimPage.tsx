'use client'

import { useState } from 'react'
import { FacturationFilterBar } from '@/components/organisms/facturation-table/facturation-filter-bar'
import { FacturationInterimPharmacyTable } from '@/components/organisms/facturation-table/facturation-interim-pharmacy-table'
import { FacturationTable } from '@/components/organisms/facturation-table/facturation-table'
import { FacturationLinesHeader } from '@/components/organisms/FacturationLinesHeader'
import { FinanceLineRowActions } from '@/components/molecules/FinanceLineRowActions'
import { FinanceLineCreateModal } from '@/components/organisms/FinanceLineCreateModal'
import { ViewToggle, interimViewOptions, type InterimView } from '@/components/molecules/ViewToggle'
import { useFacturationLinesQuery } from '@/lib/hooks/use-facturation-lines-query'
import type { FacturationLinesFilterConfig } from '@/lib/filters/facturation-lines-filter-config'
import type { FacturationLineListFiltersInput } from '@/view-models/facturation-line-filters.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { FacturationMissionOption } from '@/view-models/finance-line'

type Ref = { id: string; name: string }

type Props = {
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

export function FacturationInterimPage({
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
  const [view, setView] = useState<InterimView>('client')
  const { values, setFilters, reset, rows } = useFacturationLinesQuery(
    'INTERIM',
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
      <ViewToggle view={view} onChange={setView} items={interimViewOptions} />
      <FacturationFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={setFilters}
        onReset={reset}
      />
      {view === 'client' ? (
        <FacturationInterimPharmacyTable rows={rows} />
      ) : (
        <FacturationTable rows={rows} renderActions={(row) => <FinanceLineRowActions row={row} />} />
      )}
      <FinanceLineCreateModal
        open={open}
        onClose={() => setOpen(false)}
        title={createTitle}
        defaultKind="INTERIM"
        pharmacies={pharmacies}
        candidates={candidates}
        missions={missions}
        recruiters={recruiters}
      />
    </div>
  )
}
