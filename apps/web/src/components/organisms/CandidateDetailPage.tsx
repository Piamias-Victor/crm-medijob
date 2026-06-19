'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CandidateDetailTabs, type CandidateDetailTab } from '@/components/molecules/CandidateDetailTabs'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CandidateProfileForm } from '@/components/molecules/CandidateProfileForm'
import { CandidateMissionsTab } from '@/components/organisms/CandidateMissionsTab'
import { EntityActivityLogTab } from '@/components/molecules/EntityActivityLogTab'
import { pageEntrance, tabPanelMotion } from '@/lib/motion/variants'
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
  const missionsDescription = useMemo(
    () =>
      profile.missions.length === 0
        ? 'Aucune mission active pour ce candidat.'
        : `${profile.missions.length} mission(s) en cours de suivi.`,
    [profile.missions.length],
  )

  return (
    <motion.div
      variants={pageEntrance}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-[88rem] flex-col gap-6"
    >
      <DetailPageHeader
        backHref="/candidats"
        backLabel="CVthèque"
        name={name}
        jobTitle={profile.jobTitleName}
        city={profile.city ?? undefined}
        referentName={profile.referentName}
      />
      <CandidateDetailTabs
        active={tab}
        onChange={setTab}
        missionCount={profile.missions.length}
        activityCount={activities.length}
      />
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="w-full" {...tabPanelMotion}>
          {tab === 'profil' ? (
            <SectionCard variant="glass" title="Profil candidat" description="Coordonnées, mobilité et préférences pour le matching." bodyClassName="p-5 sm:p-6">
              <CandidateProfileForm candidateId={profile.id} profile={profile} referentials={referentials} />
            </SectionCard>
          ) : null}
          {tab === 'historique' ? (
            <SectionCard variant="glass" title="Historique" description="Timeline des interactions et notes liées au candidat." bodyClassName="p-5 sm:p-6">
              <EntityActivityLogTab
                scope={{ entityType: 'CANDIDATE', entityId: profile.id }}
                initialLogs={activities}
              />
            </SectionCard>
          ) : null}
          {tab === 'missions' ? (
            <SectionCard variant="glass" title="Missions actives" description={missionsDescription} bodyClassName="p-4 sm:p-5">
              <CandidateMissionsTab candidateId={profile.id} stages={referentials.pipelineStages} missions={profile.missions} />
            </SectionCard>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
