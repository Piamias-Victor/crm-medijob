'use client'

import { User } from 'lucide-react'
import { ContactListCard } from '@/components/molecules/ContactListCard'
import { EntityGridList } from '@/components/organisms/EntityGridList'
import type { ContactListRow } from '@/view-models/contact-list'

type Props = {
  rows: ContactListRow[]
}

export function ContactList({ rows }: Props) {
  return (
    <EntityGridList
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <ContactListCard row={row} />}
      emptyIcon={User}
      emptyTitle="Aucun contact"
      emptyDescription="Ajoutez votre premier interlocuteur au portefeuille."
    />
  )
}
