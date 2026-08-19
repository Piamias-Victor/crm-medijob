'use client'

import { Inbox } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import { buildApplicationInboxColumns } from '@/components/molecules/application-inbox-columns'
import { applicationDetailPath } from '@/view-models/inbox-detail-href'
import type { InboxItem } from '@/view-models/application-inbox'

const columns = buildApplicationInboxColumns()

export function ApplicationInbox({ items }: { items: InboxItem[] }) {
  return (
    <EntityTable
      rows={items}
      columns={columns}
      getRowId={(row) => row.id}
      getRowHref={(row) => applicationDetailPath(row.id)}
      emptyIcon={Inbox}
      emptyTitle="Boîte de réception vide"
      emptyDescription="Les candidatures du site apparaîtront ici après le sync horaire."
    />
  )
}
