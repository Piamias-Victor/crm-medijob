'use client'

import { CandidateCreateForm } from '@/components/organisms/candidate-create-form/CandidateCreateForm'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CandidateDuplicateAlertModal } from '@/components/molecules/candidate-duplicate-alert/CandidateDuplicateAlertModal'
import { useAppProfileDetailActions } from '@/lib/hooks/use-app-profile-detail-actions'
import { appProfileDetailPath } from '@/view-models/inbox-detail-href'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { CandidateFormReferentials } from '@/view-models/referential'
import { useRouter } from 'next/navigation'

type Props = {
  profile: AppProfileListItem
  defaultValues: CandidateCreateInput
  referentials: CandidateFormReferentials
}

export function AppProfileConvertPage({ profile, defaultValues, referentials }: Props) {
  const router = useRouter()
  const actions = useAppProfileDetailActions(profile.id, defaultValues)
  const name = `${profile.firstName} ${profile.lastName}`.trim()

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref={appProfileDetailPath(profile.id)}
          backLabel="Profil app"
          name={`Convertir · ${name}`}
        />
      }
      tabKey="convert"
    >
      <SectionCard
        variant="glass"
        title="Profil complet"
        description="Complétez la fiche Candidate. Un doublon proposera une fusion."
        bodyClassName="p-5 sm:p-6"
      >
        <CandidateCreateForm
          defaultValues={defaultValues}
          referentials={referentials}
          submitLabel="Convertir en profil"
          submitting={actions.accepting}
          onSubmitCandidate={(data) => actions.submitCreate(data, false)}
        />
      </SectionCard>
      <CandidateDuplicateAlertModal
        open={actions.matches.length > 0}
        matches={actions.matches}
        variant="merge"
        onClose={() => actions.setMatches([])}
        onContinue={() => actions.continueCreate()}
        onEdit={(id) => router.push(`/candidats/${id}`)}
        onMerge={actions.merge}
      />
    </EntityDetailShell>
  )
}
