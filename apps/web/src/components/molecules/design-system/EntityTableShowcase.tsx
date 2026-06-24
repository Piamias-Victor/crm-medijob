'use client'

import { useMemo } from 'react'
import { Table2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import {
  buildDemoListRows,
  demoFilterConfig,
} from '@/components/molecules/design-system/entity-table-showcase-data'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import { FilterBar } from '@/components/organisms/filter-bar/filter-bar'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import { filterDemoListRows } from '@/lib/filters/demo-list-filter'
import type { DemoListRow } from '@/lib/filters/demo-list-types'
import { formatDateFr } from '@/view-models/format-date-fr'

const columns: ColumnDef<DemoListRow>[] = [
  { id: 'name', header: 'Nom', accessor: (row) => row.name, sortable: true },
  { id: 'city', header: 'Ville', accessor: (row) => row.city, sortable: true },
  { id: 'metier', header: 'Métier', accessor: (row) => row.metier, sortable: true },
  {
    id: 'createdAt',
    header: 'Créé le',
    accessor: (row) => row.createdAt,
    sortable: true,
    cell: (row) => formatDateFr(row.createdAt),
  },
]

export function EntityTableShowcase() {
  const rows = useMemo(() => buildDemoListRows(), [])
  const { values, filters, onChange, reset } = useEntityFilters(demoFilterConfig)
  const filteredRows = useMemo(() => filterDemoListRows(rows, filters), [filters, rows])

  return (
    <div className="space-y-4">
      <FilterBar config={demoFilterConfig} values={values} onChange={onChange} onReset={reset} />
      <EntityTable
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
        emptyIcon={Table2}
        emptyTitle="Aucune ligne"
        emptyDescription="Ajustez les filtres pour afficher des résultats."
        renderActions={() => (
          <Button type="button" variant="accent" className="px-2 py-1 text-xs shadow-sm shadow-accent/20">
            Ouvrir
          </Button>
        )}
      />
    </div>
  )
}
