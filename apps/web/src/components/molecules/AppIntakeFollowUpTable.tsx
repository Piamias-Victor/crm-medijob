'use client'

import { useMemo, useState } from 'react'
import { Smartphone } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import { buildAppIntakeFollowUpColumns } from '@/components/molecules/app-intake-follow-up-columns'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Ref = { id: string; name: string }
type Props = { items: AppProfileListItem[]; recruiters?: readonly Ref[] }

export function AppIntakeFollowUpTable({ items, recruiters = [] }: Props) {
  const [sort, setSort] = useState<EntityTableSortState | null>({
    columnId: 'relanceAt',
    direction: 'asc',
  })
  const columns = useMemo(() => buildAppIntakeFollowUpColumns(recruiters), [recruiters])

  return (
    <EntityTable
      rows={items}
      columns={columns}
      getRowId={(row) => row.id}
      emptyIcon={Smartphone}
      emptyTitle="Aucune entrée app"
      emptyDescription="Les nouveaux inscrits Badakan apparaissent ici automatiquement."
      sort={sort}
      onSortChange={setSort}
      pageSize={25}
      pageSizeOptions={[25, 50, 100]}
      scrollMaxHeightClassName="max-h-[min(70vh,40rem)]"
    />
  )
}
