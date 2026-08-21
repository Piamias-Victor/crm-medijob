'use client'

import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { DetailFieldList } from '@/components/molecules/DetailFieldList'
import { ApplicationDetailActions } from '@/components/molecules/ApplicationDetailActions'
import { CandidateDuplicateAlertModal } from '@/components/molecules/candidate-duplicate-alert/CandidateDuplicateAlertModal'
import { useApplicationDetailActions } from '@/lib/hooks/use-application-detail-actions'
import { applicationDetailFields } from '@/view-models/application-detail-fields'
import { inboxFullName, type InboxItem } from '@/view-models/application-inbox'
import { candidatsPageHref } from '@/view-models/candidats-tab'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import { useRouter } from 'next/navigation'

type Detail = InboxItem & { status: string; jobTitleId: string | null }

type Props = { application: Detail; defaults: CandidateCreateInput }

export function ApplicationDetailPage({ application, defaults }: Props) {
  const router = useRouter()
  const actions = useApplicationDetailActions(application.id, defaults)
  const pending = application.status === 'EN_ATTENTE'

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref={candidatsPageHref('inbox')}
          backLabel="Candidatures reçues"
          name={inboxFullName(application)}
          jobTitle={application.jobTitle?.name}
          city={application.city ?? undefined}
        />
      }
      tabKey="infos"
    >
      <SectionCard
        variant="glass"
        title="Candidature site"
        description="Vérifiez les infos avant conversion ou entretien."
        bodyClassName="space-y-5 p-5 sm:p-6"
      >
        <DetailFieldList fields={applicationDetailFields(application)} />
        <ApplicationDetailActions
          applicationId={application.id}
          pending={pending}
          cvUrl={application.cvUrl}
          refusing={actions.refusing}
          accepting={actions.accepting}
          onRefuse={actions.refuse}
          onInterview={actions.startInterview}
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
