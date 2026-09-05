'use client'

import { useMemo } from 'react'
import type { CandidateDetailTab } from '@/components/molecules/CandidateDetailTabs'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CandidateHistoryTab } from '@/components/molecules/CandidateHistoryTab'
import { CandidateMissionsTab } from '@/components/organisms/CandidateMissionsTab'
import { CandidateDocumentsTab } from '@/components/organisms/CandidateDocumentsTab'
import { CandidateProfilTab } from '@/components/organisms/CandidateProfilTab'
import { CandidateInterviewsTab } from '@/components/organisms/CandidateInterviewsTab'
import { CandidateAvailabilityTab } from '@/components/organisms/CandidateAvailabilityTab'
import { CANDIDATE_TAB_META } from '@/view-models/candidate-tab-meta'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { DocumentListRow } from '@/view-models/document-list'
import type { InterviewListRow } from '@/view-models/interview-list'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { CandidateDetailReferentials } from '@/view-models/candidate-detail-referentials'
import type { BadakanCommentRow } from '@/view-models/badakan-comment'

type Props = {
  tab: CandidateDetailTab
  profile: CandidateProfilePayload
  referentials: CandidateDetailReferentials
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
  interviews: InterviewListRow[]
  comments: BadakanCommentRow[]
  onPresentPharmacy?: () => void
  onPresentRadius?: () => void
}

export function CandidateDetailTabPanel({
  tab,
  profile,
  referentials,
  activities,
  documents,
  interviews,
  comments,
  onPresentPharmacy,
  onPresentRadius,
}: Props) {
  const meta = CANDIDATE_TAB_META[tab]
  const missionsDescription = useMemo(
    () =>
      profile.missions.length === 0
        ? 'Aucune mission active pour ce candidat.'
        : `${profile.missions.length} mission(s) en cours de suivi.`,
    [profile.missions.length],
  )

  return (
    <SectionCard
      variant="glass"
      title={tab === 'missions' ? 'Missions actives' : meta.title}
      description={tab === 'missions' ? missionsDescription : meta.description}
      bodyClassName={tab === 'missions' ? 'p-4 sm:p-5' : 'p-5 sm:p-6'}
    >
      {tab === 'profil' ? (
        <CandidateProfilTab
          profile={profile}
          referentials={referentials}
          onPresentPharmacy={onPresentPharmacy}
          onPresentRadius={onPresentRadius}
        />
      ) : null}
      {tab === 'dispos' ? <CandidateAvailabilityTab candidateId={profile.id} /> : null}
      {tab === 'historique' ? (
        <CandidateHistoryTab
          scope={{ entityType: 'CANDIDATE', entityId: profile.id }}
          initialLogs={activities}
          positionings={profile.historyPositionings}
          comments={comments}
        />
      ) : null}
      {tab === 'missions' ? (
        <CandidateMissionsTab
          candidateId={profile.id}
          stages={referentials.pipelineStages}
          missions={profile.missions}
        />
      ) : null}
      {tab === 'entretiens' ? (
        <CandidateInterviewsTab
          candidateId={profile.id}
          interviews={interviews}
          documents={documents}
        />
      ) : null}
      {tab === 'documents' ? (
        <CandidateDocumentsTab profile={profile} documents={documents} />
      ) : null}
    </SectionCard>
  )
}
