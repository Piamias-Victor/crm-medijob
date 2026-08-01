'use client'

import { useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Table2 } from 'lucide-react'
import {
  CvthequeTableActions,
  cvthequeTableColumns,
} from '@/components/organisms/cvtheque-table/cvtheque-table-columns'
import { CvthequeFilterBar } from '@/components/organisms/cvtheque-table/cvtheque-filter-bar'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { CandidateQuickView } from '@/components/organisms/CandidateQuickView'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { CvthequeFilterValues } from '@/lib/filters/cvtheque-filter-map'
import { buildCvthequeReturnPath } from '@/lib/cvtheque-candidate-href'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { CandidateTableRow } from '@/view-models/candidate-list-vm'

type Props = {
  filterConfig: CvthequeFilterConfig
  values: CvthequeFilterValues
  onChange: (values: CvthequeFilterValues) => void
  onReset: () => void
  rows: CandidateTableRow[]
  exportFilters: CandidateListFilters
  sort: EntityTableSortState | null
  onSortChange: (sort: EntityTableSortState | null) => void
}

export function CvthequeTable({
  filterConfig,
  values,
  onChange,
  onReset,
  rows,
  exportFilters,
  sort,
  onSortChange,
}: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [quickViewId, setQuickViewId] = useState<string | null>(null)
  const returnPath = useMemo(
    () => buildCvthequeReturnPath(pathname, searchParams.toString()),
    [pathname, searchParams],
  )

  return (
    <div className="space-y-4">
      <CvthequeFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={onChange}
        onReset={onReset}
        exportFilters={exportFilters}
        sort={sort}
        exportDisabled={rows.length === 0}
      />
      <EntityTable
        rows={rows}
        columns={cvthequeTableColumns}
        getRowId={(row) => row.id}
        onRowClick={(row) => setQuickViewId(row.id)}
        emptyIcon={Table2}
        emptyTitle="Aucun candidat"
        emptyDescription="Ajustez les filtres pour afficher des résultats."
        renderActions={(row) => (
          <CvthequeTableActions row={row} returnPath={returnPath} onQuickView={setQuickViewId} />
        )}
        sort={sort}
        onSortChange={onSortChange}
      />
      <CandidateQuickView
        candidateId={quickViewId}
        returnPath={returnPath}
        onClose={() => setQuickViewId(null)}
      />
    </div>
  )
}
