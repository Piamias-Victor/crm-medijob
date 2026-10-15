'use client'

import { useState } from 'react'
import { CandidateDetailTabs, type CandidateDetailTab } from '@/components/molecules/CandidateDetailTabs'
import { CandidateDetailTabPanel } from '@/components/molecules/CandidateDetailTabPanel'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { CandidatePresentModals } from '@/components/organisms/CandidatePresentModals'
import { CandidateDetailHeaderActions } from '@/components/molecules/CandidateDetailHeaderActions'
import { DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'
import { candidateBlacklistHeaderChips } from '@/view-models/candidate-blacklist-header-chips'
import type { ActivityLogPromptPayload } from '@/components/molecules/email-button/activity-log-prompt-payload'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { CandidateDetailReferentials } from '@/view-models/candidate-detail-referentials'

type Props = {
  profile: CandidateProfilePayload
  referentials: CandidateDetailReferentials
  backHref?: string
  backLabel?: string
}

export function CandidateDetailPage({
  profile,
  referentials,
  backHref = '/candidats',
  backLabel = 'CVthèque',
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
          backLabel={backLabel}
          name={name}
          jobTitle={profile.jobTitleName}
          city={profile.city ?? undefined}
          referentName={profile.referentName ?? undefined}
          chips={candidateBlacklistHeaderChips(profile.effectiveStatus)}
        />
      }
      meta={<CandidateDetailHeaderActions candidateId={profile.id} candidateName={name} origin={profile.origin} />}
      tabs={
        <CandidateDetailTabs
          active={tab}
          onChange={setTab}
          missionCount={profile.missions.length}
        />
      }
      tabKey={tab}
    >
      <CandidateDetailTabPanel
        tab={tab}
        profile={profile}
        referentials={referentials}
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
