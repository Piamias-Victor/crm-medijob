'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { MissionQuickCreateForm } from '@/components/molecules/MissionQuickCreateForm'
import type { MissionQuickCreateInput } from '@/view-models/mission-quick-create.schema'

type Ref = { id: string; name: string }

type Props = {
  open: boolean
  submitting: boolean
  pharmacies: Ref[]
  jobTitles: Ref[]
  recruiters: Ref[]
  errorMessage?: string | null
  onClose: () => void
  onSubmit: (data: MissionQuickCreateInput) => void
  onCreateJobTitle: (name: string) => Promise<Ref>
}

export function MissionFormModal({
  open,
  submitting,
  pharmacies,
  jobTitles,
  recruiters,
  errorMessage,
  onClose,
  onSubmit,
  onCreateJobTitle,
}: Props) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Nouvelle mission"
      description="Créez un besoin de recrutement rattaché à une officine."
    >
      <MissionQuickCreateForm
        pharmacies={pharmacies}
        jobTitles={jobTitles}
        recruiters={recruiters}
        submitting={submitting}
        errorMessage={errorMessage}
        onSubmit={onSubmit}
        onCreateJobTitle={onCreateJobTitle}
      />
    </GlassModal>
  )
}
