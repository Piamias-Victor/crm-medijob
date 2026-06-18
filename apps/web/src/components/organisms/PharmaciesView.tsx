'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import { toPharmacyFormValues } from '@/view-models/pharmacy-form'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'
import { Button } from '@/components/atoms/Button'
import { EmptyState } from '@/components/atoms/EmptyState'
import { Modal } from '@/components/atoms/Modal'
import { PharmacyForm } from '@/components/molecules/PharmacyForm'
import { PharmacyTable } from '@/components/organisms/PharmacyTable'

type Ref = { id: string; name: string }
type FormState = { open: boolean; id?: string; values?: Partial<PharmacyInput> }

export function PharmaciesView({ rows, groupements, softwares }: { rows: PharmacyListRow[]; groupements: Ref[]; softwares: Ref[] }) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [form, setForm] = useState<FormState>({ open: false })

  const refresh = () => {
    setForm({ open: false })
    router.refresh()
  }
  const create = trpc.pharmacy.create.useMutation({ onSuccess: refresh })
  const update = trpc.pharmacy.update.useMutation({ onSuccess: refresh })
  const remove = trpc.pharmacy.softDelete.useMutation({ onSuccess: () => router.refresh() })
  const newGroupement = trpc.pharmacy.createGroupement.useMutation()
  const newSoftware = trpc.pharmacy.createSoftware.useMutation()

  const openEdit = async (id: string) => {
    const pharmacy = await utils.pharmacy.getById.fetch({ id })
    if (pharmacy) setForm({ open: true, id, values: toPharmacyFormValues(pharmacy) })
  }
  const onDelete = (id: string) => {
    if (window.confirm('Supprimer cette pharmacie ?')) remove.mutate({ id })
  }
  const onSubmit = (data: PharmacyInput) =>
    form.id ? update.mutate({ id: form.id, data }) : create.mutate(data)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-fg">Pharmacies</h1>
        <Button onClick={() => setForm({ open: true, values: {} })}>
          <Plus className="size-4" /> Nouvelle pharmacie
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Aucune pharmacie"
          description="Ajoutez votre première pharmacie au portefeuille."
        />
      ) : (
        <PharmacyTable rows={rows} onEdit={openEdit} onDelete={onDelete} />
      )}

      <Modal
        open={form.open}
        onClose={() => setForm({ open: false })}
        title={form.id ? 'Modifier la pharmacie' : 'Nouvelle pharmacie'}
      >
        <PharmacyForm
          key={form.id ?? 'new'}
          defaultValues={form.values}
          groupements={groupements}
          softwares={softwares}
          submitting={create.isPending || update.isPending}
          onSubmit={onSubmit}
          onSearchSiret={(query) => utils.pharmacy.searchSiret.fetch({ query })}
          onCreateGroupement={(name) => newGroupement.mutateAsync({ name })}
          onCreateSoftware={(name) => newSoftware.mutateAsync({ name })}
        />
      </Modal>
    </div>
  )
}
