'use client'

import { useState } from 'react'
import { GlassModal } from '@/components/molecules/GlassModal'
import { Button } from '@/components/atoms/Button'
import {
  SOFT_DELETE_ERROR,
  SOFT_DELETE_IRREVERSIBLE,
  softDeleteTitle,
} from '@/components/molecules/soft-delete-modal/soft-delete-copy'
import { useToastStore } from '@/stores/toast-store'

type Props = {
  entityName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}

export function SoftDeleteModal({ entityName, open, onOpenChange, onConfirm }: Props) {
  const push = useToastStore((s) => s.push)
  const [loading, setLoading] = useState(false)

  const close = () => {
    if (!loading) onOpenChange(false)
  }

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch {
      push({ variant: 'error', message: SOFT_DELETE_ERROR })
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassModal
      open={open}
      onClose={close}
      title={softDeleteTitle(entityName)}
      description={SOFT_DELETE_IRREVERSIBLE}
      className="max-w-md"
      role="alertdialog"
      trapFocus
      preventDismiss={loading}
    >
      <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
        <Button type="button" variant="outline" onClick={close} disabled={loading}>
          Annuler
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={handleConfirm}
          disabled={loading}
          className="min-w-30"
        >
          {loading ? 'Suppression…' : 'Supprimer'}
        </Button>
      </div>
    </GlassModal>
  )
}
