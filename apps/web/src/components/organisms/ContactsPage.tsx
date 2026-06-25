'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { User, Plus } from 'lucide-react'
import { accentButtonClassName } from '@/lib/button-styles'
import { EntityListPageShell } from '@/components/molecules/EntityListPageShell'
import { ContactTable } from '@/components/organisms/contact-table/contact-table'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { useContactListQuery } from '@/lib/hooks/use-contact-list-query'
import type { ContactFilterConfig } from '@/lib/filters/contact-filter-config'
import type { ContactListRow } from '@/view-models/contact-list'
import type { ContactListFilters } from '@/view-models/contact-list-filters.schema'

type Props = {
  initialRows: ContactListRow[]
  serverFilters: ContactListFilters
  filterConfig: ContactFilterConfig
}

export function ContactsPage({ initialRows, serverFilters, filterConfig }: Props) {
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const [count, setCount] = useState(initialRows.length)
  const onCountChange = useCallback((next: number) => setCount(next), [])
  const { values, setFilters, reset, rows } = useContactListQuery(
    initialRows,
    serverFilters,
    filterConfig,
    onCountChange,
  )
  const description = useMemo(() => `${count} interlocuteur(s) au portefeuille`, [count])

  return (
    <EntityListPageShell
      icon={<User className="size-5" />}
      title="Contacts"
      description={description}
      sectionTitle="Annuaire"
      sectionDescription="Interlocuteurs des officines : titulaires, adjoints et équipes."
      action={
        <Link href="/contacts/new" className={accentButtonClassName}>
          <Plus className="size-4" />
          Nouveau contact
        </Link>
      }
    >
      <ContactTable
        filterConfig={filterConfig}
        values={values}
        onChange={setFilters}
        onReset={reset}
        rows={rows}
        sort={sort}
        onSortChange={setSort}
      />
    </EntityListPageShell>
  )
}
