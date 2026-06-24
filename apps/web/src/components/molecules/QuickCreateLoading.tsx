'use client'

import { GlassModal } from '@/components/molecules/GlassModal'

type Props = { onClose: () => void }

export function QuickCreateLoading({ onClose }: Props) {
  return (
    <GlassModal open onClose={onClose} title="Chargement" description="Préparation du formulaire…">
      <p className="text-sm text-fg-muted">Chargement des référentiels…</p>
    </GlassModal>
  )
}
