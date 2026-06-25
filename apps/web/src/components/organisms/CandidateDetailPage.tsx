'use client'

import { useState } from 'react'
import { CandidateDetailTabs, type CandidateDetailTab } from '@/components/molecules/CandidateDetailTabs'
import { CandidateDetailTabPanel } from '@/components/molecules/CandidateDetailTabPanel'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { CandidatePresentModals } from '@/components/organisms/CandidatePresentModals'
import { DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'
import type { ActivityLogPromptPayload } from '@/components/molecules/email-button/activity-log-prompt-payload'
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
  profile: CandidateProfilePayload
  referentials: Referentials
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
  backHref?: string
}

export function CandidateDetailPage({
  profile,
  referentials,
  activities,
  documents,
  backHref = '/candidats',
}: Props) {
  const [tab, setTab] = useState<CandidateDetailTab>('profil')
  const [presentOpen, setPresentOpen] = useState(false)
  const [presentRadiusOpen, setPresentRadiusOpen] = useState(false)
  const [activityLogPrompt, setActivityLogPrompt] = useState<ActivityLogPromptPayload | null>(null)
  const name = `${profile.firstName} ${profile.lastName}`.trim()

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref={backHref}
          backLabel="CVthèque"
          name={name}
          jobTitle={profile.jobTitleName}
          city={profile.city ?? undefined}
          referentName={profile.referentName}
        />
      }
      tabs={
        <CandidateDetailTabs
          active={tab}
          onChange={setTab}
          missionCount={profile.missions.length}
          activityCount={activities.length}
        />
      }
      tabKey={tab}
    >
      <CandidateDetailTabPanel
        tab={tab}
        profile={profile}
        referentials={referentials}
        activities={activities}
        documents={documents}
        onPresentPharmacy={() => setPresentOpen(true)}
        onPresentRadius={() => setPresentRadiusOpen(true)}
      />
      <CandidatePresentModals
        candidateId={profile.id}
        defaultRadiusKm={profile.mobilityRadiusKm ?? DEFAULT_MOBILITY_RADIUS_KM}
        presentOpen={presentOpen}
        presentRadiusOpen={presentRadiusOpen}
        activityLogPrompt={activityLogPrompt}
        onClosePresent={() => setPresentOpen(false)}
        onClosePresentRadius={() => setPresentRadiusOpen(false)}
        onActivityLogPrompt={setActivityLogPrompt}
        onActivityLogPromptClose={() => setActivityLogPrompt(null)}
      />
    </EntityDetailShell>
  )
}
