'use client'

import { CandidateCreateForm } from '@/components/organisms/candidate-create-form/CandidateCreateForm'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CandidateDuplicateAlertModal } from '@/components/molecules/candidate-duplicate-alert/CandidateDuplicateAlertModal'
import { useApplicationDetailActions } from '@/lib/hooks/use-application-detail-actions'
import { applicationDetailPath } from '@/view-models/inbox-detail-href'
import { inboxFullName, type InboxItem } from '@/view-models/application-inbox'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { CandidateFormReferentials } from '@/view-models/referential'
import { useRouter } from 'next/navigation'

type Props = {
  application: InboxItem
  defaultValues: CandidateCreateInput
  referentials: CandidateFormReferentials
}

export function ApplicationConvertPage({ application, defaultValues, referentials }: Props) {
  const router = useRouter()
  const actions = useApplicationDetailActions(application.id, defaultValues)

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref={applicationDetailPath(application.id)}
          backLabel="Candidature"
          name={`Convertir · ${inboxFullName(application)}`}
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
