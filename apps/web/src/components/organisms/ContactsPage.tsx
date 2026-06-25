'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { User, Plus } from 'lucide-react'
import { accentButtonClassName } from '@/lib/button-styles'
import { EntityListPageShell } from '@/components/molecules/EntityListPageShell'
import { ContactList } from '@/components/organisms/ContactList'
import type { ContactListRow } from '@/view-models/contact-list'

type Props = {
  rows: ContactListRow[]
}

export function ContactsPage({ rows }: Props) {
  const description = useMemo(() => `${rows.length} interlocuteur(s) au portefeuille`, [rows.length])

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
      <ContactList rows={rows} />
    </EntityListPageShell>
  )
}
