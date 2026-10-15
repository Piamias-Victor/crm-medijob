'use client'

import { useMemo } from 'react'
import type { CandidateDetailTab } from '@/components/molecules/CandidateDetailTabs'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CandidateHistoryTabContainer } from '@/components/molecules/CandidateHistoryTabContainer'
import { CandidateMissionsTab } from '@/components/organisms/CandidateMissionsTab'
import { CandidateDocumentsTabContainer } from '@/components/organisms/CandidateDocumentsTabContainer'
import { CandidateProfilTab } from '@/components/organisms/CandidateProfilTab'
import { CandidateInterviewsTabContainer } from '@/components/organisms/CandidateInterviewsTabContainer'
import { CandidateAvailabilityTab } from '@/components/organisms/CandidateAvailabilityTab'
import { CANDIDATE_TAB_META } from '@/view-models/candidate-tab-meta'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { CandidateDetailReferentials } from '@/view-models/candidate-detail-referentials'

type Props = {
  tab: CandidateDetailTab
  profile: CandidateProfilePayload
  referentials: CandidateDetailReferentials
  onPresentPharmacy?: () => void
  onPresentRadius?: () => void
}

export function CandidateDetailTabPanel({
  tab,
  profile,
  referentials,
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
        <CandidateHistoryTabContainer
          candidateId={profile.id}
          positionings={profile.historyPositionings}
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
        <CandidateInterviewsTabContainer candidateId={profile.id} />
      ) : null}
      {tab === 'documents' ? <CandidateDocumentsTabContainer profile={profile} /> : null}
    </SectionCard>
  )
}
