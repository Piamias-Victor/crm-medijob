'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { CandidateQuickCreateForm } from '@/components/molecules/CandidateQuickCreateForm'
import type { CandidateQuickCreateInput } from '@/view-models/candidate-quick-create.schema'

type Ref = { id: string; name: string }

type Props = {
  open: boolean
  submitting: boolean
  jobTitles: Ref[]
  recruiters: Ref[]
  errorMessage?: string | null
  onClose: () => void
  onSubmit: (data: CandidateQuickCreateInput) => void
}

export function CandidateFormModal({
  open,
  submitting,
  jobTitles,
  recruiters,
  errorMessage,
  onClose,
  onSubmit,
}: Props) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Nouveau candidat"
      description="Ajoutez un profil à la CVthèque — vous pourrez compléter la fiche ensuite."
    >
      <CandidateQuickCreateForm
        jobTitles={jobTitles}
        recruiters={recruiters}
        submitting={submitting}
        errorMessage={errorMessage}
        onSubmit={onSubmit}
      />
    </GlassModal>
  )
}
