'use client'

import { CandidateCreateForm } from '@/components/organisms/candidate-create-form/CandidateCreateForm'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CANDIDATE_TAB_META } from '@/view-models/candidate-tab-meta'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { CandidateFormReferentials } from '@/view-models/referential'

type Props = {
  defaultValues: CandidateCreateInput
  referentials: CandidateFormReferentials
}

export function CandidateCreatePage({ defaultValues, referentials }: Props) {
  const meta = CANDIDATE_TAB_META.profil

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader backHref="/candidats" backLabel="CVthèque" name="Nouveau candidat" />
      }
      tabKey="profil"
    >
      <SectionCard variant="glass" title={meta.title} description={meta.description} bodyClassName="p-5 sm:p-6">
        <CandidateCreateForm defaultValues={defaultValues} referentials={referentials} />
      </SectionCard>
    </EntityDetailShell>
  )
}
