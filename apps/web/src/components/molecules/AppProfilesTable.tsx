'use client'

import { Smartphone } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import { buildAppProfileColumns } from '@/components/molecules/app-profile-columns'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = {
  items: AppProfileListItem[]
  busyId: string | null
  onAccept: (row: AppProfileListItem) => void
  onIgnore: (row: AppProfileListItem) => void
}

export function AppProfilesTable({ items, busyId, onAccept, onIgnore }: Props) {
  return (
    <EntityTable
      rows={items}
      columns={buildAppProfileColumns(onAccept, onIgnore, busyId)}
      getRowId={(row) => row.id}
      emptyIcon={Smartphone}
      emptyTitle="Aucun profil app en attente"
      emptyDescription="Synchronisez les nouveaux inscrits Badakan pour les faire apparaître ici."
    />
  )
}
