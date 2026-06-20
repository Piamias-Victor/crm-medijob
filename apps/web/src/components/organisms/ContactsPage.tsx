'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { Button } from '@/components/atoms/Button'
import { EntityListPageShell } from '@/components/molecules/EntityListPageShell'
import { ContactFormModal } from '@/components/molecules/ContactFormModal'
import { ContactList } from '@/components/organisms/ContactList'
import type { ContactListRow } from '@/view-models/contact-list'

type Ref = { id: string; name: string }

type Props = {
  rows: ContactListRow[]
  pharmacies: Ref[]
}

export function ContactsPage({ rows, pharmacies }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const description = useMemo(() => `${rows.length} interlocuteur(s) au portefeuille`, [rows.length])
  const refresh = () => {
    setOpen(false)
    router.refresh()
  }
  const mutation = useEntityMutation({ onSuccess: refresh, successMessage: 'Contact créé' })
  const create = trpc.contact.create.useMutation(mutation)

  return (
    <EntityListPageShell
      icon={<User className="size-5" />}
      title="Contacts"
      description={description}
      sectionTitle="Annuaire"
      sectionDescription="Interlocuteurs des officines : titulaires, adjoints et équipes."
      action={
        <Button variant="accent" className="shadow-md shadow-accent/20" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Nouveau contact
        </Button>
      }
      modal={
        <ContactFormModal
          open={open}
          pharmacies={pharmacies}
          submitting={create.isPending}
          onClose={() => setOpen(false)}
          onSubmit={(data) => create.mutate(data)}
        />
      }
    >
      <ContactList rows={rows} />
    </EntityListPageShell>
  )
}
