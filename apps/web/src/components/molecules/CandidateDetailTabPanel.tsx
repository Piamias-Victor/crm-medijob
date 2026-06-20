'use client'

import { useMemo } from 'react'
import type { CandidateDetailTab } from '@/components/molecules/CandidateDetailTabs'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CandidateProfileForm } from '@/components/molecules/CandidateProfileForm'
import { CandidateCvStoredPreview } from '@/components/molecules/CandidateCvStoredPreview'
import { EntityActivityLogTab } from '@/components/molecules/EntityActivityLogTab'
import { CandidateCvPanel } from '@/components/organisms/CandidateCvPanel'
import { CandidateCvSummaryPanel } from '@/components/organisms/CandidateCvSummaryPanel'
import { CandidateMissionsTab } from '@/components/organisms/CandidateMissionsTab'
import { CandidateDocumentsTab } from '@/components/organisms/CandidateDocumentsTab'
import { CANDIDATE_TAB_META } from '@/view-models/candidate-tab-meta'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { DocumentListRow } from '@/view-models/document-list'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { RefItem } from '@/view-models/referential'
import type { RawStage } from '@/view-models/candidate-kanban.types'

type Referentials = {
  jobTitles: RefItem[]
  softwares: RefItem[]
  recruiters: RefItem[]
  pipelineStages: RawStage[]
}

type Props = {
  tab: CandidateDetailTab
  profile: CandidateProfilePayload
  referentials: Referentials
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
}

export function CandidateDetailTabPanel({
  tab,
  profile,
  referentials,
  activities,
  documents,
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
        <div className="flex flex-col gap-8">
          <CandidateCvPanel profile={profile} referentials={referentials} />
          <CandidateProfileForm candidateId={profile.id} profile={profile} referentials={referentials} />
          <CandidateCvSummaryPanel profile={profile} />
          {profile.cvUrl ? (
            <CandidateCvStoredPreview candidateId={profile.id} cvUrl={profile.cvUrl} />
          ) : null}
        </div>
      ) : null}
      {tab === 'historique' ? (
        <EntityActivityLogTab
          scope={{ entityType: 'CANDIDATE', entityId: profile.id }}
          initialLogs={activities}
        />
      ) : null}
      {tab === 'missions' ? (
        <CandidateMissionsTab
          candidateId={profile.id}
          stages={referentials.pipelineStages}
          missions={profile.missions}
        />
      ) : null}
      {tab === 'documents' ? (
        <CandidateDocumentsTab profile={profile} documents={documents} />
      ) : null}
    </SectionCard>
  )
}
