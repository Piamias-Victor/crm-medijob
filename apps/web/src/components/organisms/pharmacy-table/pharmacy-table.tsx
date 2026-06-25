'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Building2 } from 'lucide-react'
import { PharmacyFilterBar } from '@/components/organisms/pharmacy-table/pharmacy-filter-bar'
import {
  PharmacyTableActions,
  pharmacyTableColumns,
} from '@/components/organisms/pharmacy-table/pharmacy-table-columns'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { buildPharmacyReturnPath, pharmacyDetailHref } from '@/lib/pharmacy-href'
import type { PharmacyFilterConfig } from '@/lib/filters/pharmacy-filter-config'
import type { PharmacyFilterValues } from '@/lib/filters/pharmacy-filter-map'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'

type Props = {
  filterConfig: PharmacyFilterConfig
  values: PharmacyFilterValues
  onChange: (values: PharmacyFilterValues) => void
  onReset: () => void
  rows: PharmacyListRow[]
  sort: EntityTableSortState | null
  onSortChange: (sort: EntityTableSortState | null) => void
}

export function PharmacyTable({
  filterConfig,
  values,
  onChange,
  onReset,
  rows,
  sort,
  onSortChange,
}: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const returnPath = useMemo(
    () => buildPharmacyReturnPath(pathname, searchParams.toString()),
    [pathname, searchParams],
  )

  return (
    <div className="space-y-4">
      <PharmacyFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={onChange}
        onReset={onReset}
      />
      <EntityTable
        rows={rows}
        columns={pharmacyTableColumns}
        getRowId={(row) => row.id}
        getRowHref={(row) => pharmacyDetailHref(row.id, returnPath)}
        emptyIcon={Building2}
        emptyTitle="Aucune pharmacie"
        emptyDescription="Ajustez les filtres pour afficher des résultats."
        renderActions={(row) => <PharmacyTableActions row={row} returnPath={returnPath} />}
        sort={sort}
        onSortChange={onSortChange}
      />
    </div>
  )
}
