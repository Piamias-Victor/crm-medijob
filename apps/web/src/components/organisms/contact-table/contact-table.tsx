'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { User } from 'lucide-react'
import { ContactFilterBar } from '@/components/organisms/contact-table/contact-filter-bar'
import {
  ContactTableActions,
  contactTableColumns,
} from '@/components/organisms/contact-table/contact-table-columns'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { buildContactReturnPath, contactDetailHref } from '@/lib/contact-href'
import type { ContactFilterConfig } from '@/lib/filters/contact-filter-config'
import type { ContactFilterValues } from '@/lib/filters/contact-filter-map'
import type { ContactListRow } from '@/view-models/contact-list'

type Props = {
  filterConfig: ContactFilterConfig
  values: ContactFilterValues
  onChange: (values: ContactFilterValues) => void
  onReset: () => void
  rows: ContactListRow[]
  sort: EntityTableSortState | null
  onSortChange: (sort: EntityTableSortState | null) => void
}

export function ContactTable({
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
    () => buildContactReturnPath(pathname, searchParams.toString()),
    [pathname, searchParams],
  )

  return (
    <div className="space-y-4">
      <ContactFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={onChange}
        onReset={onReset}
      />
      <EntityTable
        rows={rows}
        columns={contactTableColumns}
        getRowId={(row) => row.id}
        getRowHref={(row) => contactDetailHref(row.id, returnPath)}
        emptyIcon={User}
        emptyTitle="Aucun contact"
        emptyDescription="Ajustez les filtres pour afficher des résultats."
        renderActions={(row) => <ContactTableActions row={row} returnPath={returnPath} />}
        sort={sort}
        onSortChange={onSortChange}
      />
    </div>
  )
}
