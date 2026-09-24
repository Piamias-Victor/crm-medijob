'use client'

import { Smartphone } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import { buildAppIntakeFollowUpColumns } from '@/components/molecules/app-intake-follow-up-columns'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { items: AppProfileListItem[] }

export function AppIntakeFollowUpTable({ items }: Props) {
  return (
    <EntityTable
      rows={items}
      columns={buildAppIntakeFollowUpColumns()}
      getRowId={(row) => row.id}
      emptyIcon={Smartphone}
      emptyTitle="Aucune entrée app"
      emptyDescription="Les nouveaux inscrits Badakan apparaissent ici automatiquement."
    />
  )
}
