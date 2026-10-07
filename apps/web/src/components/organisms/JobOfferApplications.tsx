'use client'

import { Inbox } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import { buildApplicationInboxColumns } from '@/components/molecules/application-inbox-columns'
import { SectionCard } from '@/components/molecules/SectionCard'
import { applicationDetailPath } from '@/view-models/inbox-detail-href'
import type { InboxItem } from '@/view-models/application-inbox'

const columns = buildApplicationInboxColumns().filter(
  (column) => column.id !== 'jobOffer' && column.id !== 'jobTitle',
)

type Props = { items: InboxItem[] }

export function JobOfferApplications({ items }: Props) {
  return (
    <SectionCard
      variant="glass"
      title="Candidatures"
      description={`${items.length} candidature(s) reçue(s) sur cette offre.`}
    >
      <EntityTable
        rows={items}
        columns={columns}
        getRowId={(row) => row.id}
        getRowHref={(row) => applicationDetailPath(row.id)}
        emptyIcon={Inbox}
        emptyTitle="Aucune candidature"
        emptyDescription="Les dépôts via le lien postuler apparaîtront ici."
      />
    </SectionCard>
  )
}
