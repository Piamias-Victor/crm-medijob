'use client'

import { useMemo, useState } from 'react'
import { CandidateDetailTabs, type CandidateDetailTab } from '@/components/molecules/CandidateDetailTabs'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CandidateProfileForm } from '@/components/molecules/CandidateProfileForm'
import { CandidateCvPanel } from '@/components/organisms/CandidateCvPanel'
import { CandidateCvStoredPreview } from '@/components/molecules/CandidateCvStoredPreview'
import { CandidateMissionsTab } from '@/components/organisms/CandidateMissionsTab'
import { EntityActivityLogTab } from '@/components/molecules/EntityActivityLogTab'
import { CANDIDATE_TAB_META } from '@/view-models/candidate-tab-meta'
import type { ActivityLogRow } from '@/view-models/activity-log'
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
}

export function CandidateDetailPage({ profile, referentials, activities }: Props) {
  const [tab, setTab] = useState<CandidateDetailTab>('profil')
  const name = `${profile.firstName} ${profile.lastName}`.trim()
  const meta = CANDIDATE_TAB_META[tab]
  const missionsDescription = useMemo(
    () =>
      profile.missions.length === 0
        ? 'Aucune mission active pour ce candidat.'
        : `${profile.missions.length} mission(s) en cours de suivi.`,
    [profile.missions.length],
  )

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref="/candidats"
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
      </SectionCard>
    </EntityDetailShell>
  )
}
