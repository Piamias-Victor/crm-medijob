'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { FinanceLineForm } from '@/components/organisms/FinanceLineForm'
import type { FacturationMissionOption, FinanceLineKind } from '@/view-models/finance-line'

type Ref = { id: string; name: string }

type Props = {
  open: boolean
  onClose: () => void
  title: string
  defaultKind: FinanceLineKind
  pharmacies: Ref[]
  candidates: Ref[]
  missions: FacturationMissionOption[]
  recruiters: Ref[]
}

export function FinanceLineCreateModal({
  open,
  onClose,
  title,
  defaultKind,
  pharmacies,
  candidates,
  missions,
  recruiters,
}: Props) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title={title}
      description="Pharmacie, candidat, montants. Heures, taux et mission optionnels."
      className="max-w-2xl"
    >
      <FinanceLineForm
        pharmacies={pharmacies}
        candidates={candidates}
        missions={missions}
        recruiters={recruiters}
        defaultKind={defaultKind}
        onDone={onClose}
      />
    </GlassModal>
  )
}
