'use client'

import { User } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { AnimatedEntityGrid } from '@/components/molecules/AnimatedEntityGrid'
import { ContactListCard } from '@/components/molecules/ContactListCard'
import type { ContactListRow } from '@/view-models/contact-list'

type Props = {
  rows: ContactListRow[]
}

export function ContactList({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="Aucun contact"
        description="Ajoutez votre premier interlocuteur au portefeuille."
      />
    )
  }

  return (
    <AnimatedEntityGrid
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <ContactListCard row={row} />}
    />
  )
}
