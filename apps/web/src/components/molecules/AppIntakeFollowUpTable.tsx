'use client'

import { Smartphone } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import { buildAppIntakeFollowUpColumns } from '@/components/molecules/app-intake-follow-up-columns'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Ref = { id: string; name: string }
type Props = { items: AppProfileListItem[]; recruiters?: readonly Ref[] }

export function AppIntakeFollowUpTable({ items, recruiters = [] }: Props) {
  return (
    <EntityTable
      rows={items}
      columns={buildAppIntakeFollowUpColumns(recruiters)}
      getRowId={(row) => row.id}
      emptyIcon={Smartphone}
      emptyTitle="Aucune entrée app"
      emptyDescription="Les nouveaux inscrits Badakan apparaissent ici automatiquement."
    />
  )
}
