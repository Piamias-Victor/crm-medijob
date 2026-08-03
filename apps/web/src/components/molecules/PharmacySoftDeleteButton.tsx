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
}

export function PharmacySoftDeleteButton({ pharmacyId, pharmacyName }: Props) {
  const canDelete = useCan('softDelete')
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

  if (!canDelete) return null

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="gap-1.5 text-error hover:bg-error/10"
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
