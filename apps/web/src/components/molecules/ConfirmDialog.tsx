'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { Button } from '@/components/atoms/Button'

type Props = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Supprimer',
  loading,
  onConfirm,
  onClose,
}: Props) {
  return (
    <GlassModal open={open} onClose={onClose} title={title} description={description} className="max-w-md">
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Suppression…' : confirmLabel}
        </Button>
      </div>
    </GlassModal>
  )
}
