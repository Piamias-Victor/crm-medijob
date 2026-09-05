'use client'

import { Smartphone } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import { buildAppProfileColumns } from '@/components/molecules/app-profile-columns'
import { appProfileDetailPath } from '@/view-models/inbox-detail-href'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { items: AppProfileListItem[]; filtered?: boolean }

export function AppProfilesTable({ items, filtered = false }: Props) {
  return (
    <EntityTable
      rows={items}
      columns={buildAppProfileColumns()}
      getRowId={(row) => row.id}
      getRowHref={(row) => appProfileDetailPath(row.id)}
      emptyIcon={Smartphone}
      emptyTitle={filtered ? 'Aucun profil app' : 'Aucun profil app en attente'}
      emptyDescription={
        filtered
          ? 'Aucun inscrit ne correspond à cette recherche.'
          : 'Les nouveaux inscrits Badakan apparaissent ici automatiquement.'
      }
    />
  )
}
