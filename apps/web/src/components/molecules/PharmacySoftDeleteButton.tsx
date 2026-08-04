'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'
import { useCan } from '@/lib/hooks/use-can'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

type Props = {
  pharmacyId: string
  pharmacyName: string
  /** Server-resolved permission; wins over client session when provided. */
  canDelete?: boolean
}

export function PharmacySoftDeleteButton({ pharmacyId, pharmacyName, canDelete }: Props) {
  const sessionCanDelete = useCan('softDelete')
  const allowed = canDelete ?? sessionCanDelete
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const toast = useEntityMutation({ successMessage: 'Pharmacie archivée' })
  const softDelete = trpc.pharmacy.softDelete.useMutation({
    onSuccess: () => {
      toast.onSuccess()
      router.push('/pharmacies')
    },
    onError: toast.onError,
  })

  if (!allowed) return null

  return (
    <>
      <Button
        type="button"
        variant="danger"
        className="gap-1.5 px-4 py-2 font-semibold"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" aria-hidden />
        Supprimer
      </Button>
      <SoftDeleteModal
        entityName={pharmacyName}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => {
          await softDelete.mutateAsync({ id: pharmacyId })
        }}
      />
    </>
  )
}
