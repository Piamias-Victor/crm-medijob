'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import type { PharmacyContactRow } from '@/view-models/pharmacy-detail.types'
import { Button } from '@/components/atoms/Button'
import { ContactFormModal } from '@/components/molecules/ContactFormModal'
import { PharmacyContactsList } from '@/components/molecules/PharmacyContactsList'

type Props = {
  pharmacyId: string
  pharmacyName: string
  contacts: PharmacyContactRow[]
}

export function PharmacyContactsTab({ pharmacyId, pharmacyName, contacts }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const create = trpc.contact.create.useMutation({
    onSuccess: () => {
      setOpen(false)
      router.refresh()
    },
  })

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
        defaultValues={{ pharmacyId }}
        lockedPharmacyId={pharmacyId}
        onClose={() => setOpen(false)}
        onSubmit={(data) => create.mutate(data)}
      />
    </div>
  )
}
