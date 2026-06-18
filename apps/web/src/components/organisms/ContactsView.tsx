'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import type { ContactListRow } from '@/view-models/contact-list'
import type { ContactInput } from '@/view-models/contact-form.schema'
import { toContactFormValues } from '@/view-models/contact-form'
import { Button } from '@/components/atoms/Button'
import { EmptyState } from '@/components/atoms/EmptyState'
import { Modal } from '@/components/atoms/Modal'
import { ContactForm } from '@/components/molecules/ContactForm'
import { ContactTable } from '@/components/organisms/ContactTable'

type Ref = { id: string; name: string }
type FormState = { open: boolean; id?: string; values?: Partial<ContactInput> }

export function ContactsView({ rows, pharmacies }: { rows: ContactListRow[]; pharmacies: Ref[] }) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [form, setForm] = useState<FormState>({ open: false })

  const refresh = () => {
    setForm({ open: false })
    router.refresh()
  }
  const create = trpc.contact.create.useMutation({ onSuccess: refresh })
  const update = trpc.contact.update.useMutation({ onSuccess: refresh })
  const remove = trpc.contact.softDelete.useMutation({ onSuccess: () => router.refresh() })

  const openEdit = async (id: string) => {
    const contact = await utils.contact.getById.fetch({ id })
    if (contact) setForm({ open: true, id, values: toContactFormValues(contact) })
  }
  const onDelete = (id: string) => {
    if (window.confirm('Supprimer ce contact ?')) remove.mutate({ id })
  }
  const onSubmit = (data: ContactInput) =>
    form.id ? update.mutate({ id: form.id, data }) : create.mutate(data)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-fg">Contacts</h1>
        <Button onClick={() => setForm({ open: true, values: {} })}>
          <Plus className="size-4" /> Nouveau contact
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={User}
          title="Aucun contact"
          description="Ajoutez le premier interlocuteur d'une pharmacie."
        />
      ) : (
        <ContactTable rows={rows} onEdit={openEdit} onDelete={onDelete} />
      )}

      <Modal
        open={form.open}
        onClose={() => setForm({ open: false })}
        title={form.id ? 'Modifier le contact' : 'Nouveau contact'}
      >
        <ContactForm
          key={form.id ?? 'new'}
          defaultValues={form.values}
          pharmacies={pharmacies}
          submitting={create.isPending || update.isPending}
          onSubmit={onSubmit}
        />
      </Modal>
    </div>
  )
}
