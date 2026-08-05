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
  contactId: string
  contactName: string
  /** Server-resolved permission; wins over client session when provided. */
  canDelete?: boolean
  /** Icon-only trigger for table rows. */
  compact?: boolean
  onDeleted?: () => void
}

export function ContactSoftDeleteButton({
  contactId,
  contactName,
  canDelete,
  compact = false,
  onDeleted,
}: Props) {
  const sessionCanDelete = useCan('softDelete')
  const allowed = canDelete ?? sessionCanDelete
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const toast = useEntityMutation({
    successMessage: 'Contact archivé',
    onSuccess: () => {
      setOpen(false)
      if (onDeleted) onDeleted()
      else router.push('/contacts')
    },
  })
  const softDelete = trpc.contact.softDelete.useMutation({
    onSuccess: toast.onSuccess,
  })

  if (!allowed) return null

  return (
    <>
      <Button
        type="button"
        variant={compact ? 'ghost' : 'danger'}
        className={compact ? 'size-8 p-0 text-error' : 'gap-1.5 px-4 py-2 font-semibold'}
        aria-label={compact ? 'Supprimer' : undefined}
        onClick={(event) => {
          event.stopPropagation()
          setOpen(true)
        }}
      >
        <Trash2 className="size-4" aria-hidden />
        {compact ? null : 'Supprimer'}
      </Button>
      <SoftDeleteModal
        entityName={contactName}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => {
          await softDelete.mutateAsync({ id: contactId })
        }}
      />
    </>
  )
}
