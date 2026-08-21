'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { FinanceLineForm } from '@/components/organisms/FinanceLineForm'
import type { FacturationMissionOption } from '@/view-models/finance-line'

type Ref = { id: string; name: string }

type Props = {
  open: boolean
  onClose: () => void
  pharmacies: Ref[]
  candidates: Ref[]
  missions: FacturationMissionOption[]
}

export function FinanceLineCreateModal({ open, onClose, pharmacies, candidates, missions }: Props) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Nouvelle ligne"
      description="Pharmacie, candidat, montants. Heures, taux et mission optionnels."
      className="max-w-2xl"
    >
      <FinanceLineForm
        pharmacies={pharmacies}
        candidates={candidates}
        missions={missions}
        onDone={onClose}
      />
    </GlassModal>
  )
}
