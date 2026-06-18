'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import type { ContactListRow } from '@/view-models/contact-list'
import { Button } from '@/components/atoms/Button'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ContactFormModal } from '@/components/molecules/ContactFormModal'
import { ContactList } from '@/components/organisms/ContactList'

type Ref = { id: string; name: string }

type Props = {
  rows: ContactListRow[]
  pharmacies: Ref[]
}

export function ContactsView({ rows, pharmacies }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const description = useMemo(() => `${rows.length} interlocuteur(s) au portefeuille`, [rows.length])
  const refresh = () => {
    setOpen(false)
    router.refresh()
  }

  const create = trpc.contact.create.useMutation({ onSuccess: refresh })

  return (
    <DashboardPage icon={<User className="size-5" />} title="Contacts" description={description}>
      <SectionCard
        variant="glass"
        title="Annuaire"
        description="Interlocuteurs des officines : titulaires, adjoints et équipes."
        bodyClassName="p-4 sm:p-5"
        actions={
          <Button variant="accent" className="shadow-md shadow-accent/20" onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Nouveau contact
          </Button>
        }
      >
        <ContactList rows={rows} />
      </SectionCard>
      <ContactFormModal
        open={open}
        pharmacies={pharmacies}
        submitting={create.isPending}
        onClose={() => setOpen(false)}
        onSubmit={(data) => create.mutate(data)}
      />
    </DashboardPage>
  )
}
