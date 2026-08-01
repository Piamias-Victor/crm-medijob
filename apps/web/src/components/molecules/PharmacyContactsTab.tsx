'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import type { PharmacyContactRow } from '@/view-models/pharmacy-detail.types'
import { Button } from '@/components/atoms/Button'
import { ContactFormModal } from '@/components/molecules/ContactFormModal'
import { PharmacyContactsList } from '@/components/molecules/PharmacyContactsList'

type Ref = { id: string; name: string }

type Props = {
  pharmacyId: string
  pharmacyName: string
  pharmacyReferentId?: string | null
  contacts: PharmacyContactRow[]
  recruiters: Ref[]
}

export function PharmacyContactsTab({
  pharmacyId,
  pharmacyName,
  pharmacyReferentId,
  contacts,
  recruiters,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const mutation = useEntityMutation({
    onSuccess: () => {
      setOpen(false)
      router.refresh()
    },
    successMessage: 'Contact créé',
  })
  const create = trpc.contact.create.useMutation(mutation)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="accent" className="shadow-md shadow-accent/20" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Nouveau contact
        </Button>
      </div>
      <PharmacyContactsList contacts={contacts} />
      <ContactFormModal
        open={open}
        submitting={create.isPending}
        pharmacies={[{ id: pharmacyId, name: pharmacyName }]}
        recruiters={recruiters}
        defaultValues={{ pharmacyId, referentId: pharmacyReferentId ?? null }}
        lockedPharmacyId={pharmacyId}
        onClose={() => setOpen(false)}
        onSubmit={(data) => create.mutate(data)}
      />
    </div>
  )
}
