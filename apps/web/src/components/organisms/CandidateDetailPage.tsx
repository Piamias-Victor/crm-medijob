'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  CandidateDetailTabs,
  type CandidateDetailTab,
} from '@/components/molecules/CandidateDetailTabs'
import { CandidateProfileForm } from '@/components/molecules/CandidateProfileForm'
import { CandidateMissionsTab } from '@/components/organisms/CandidateMissionsTab'
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
}

export function CandidateDetailPage({ profile, referentials }: Props) {
  const [tab, setTab] = useState<CandidateDetailTab>('profil')
  const name = `${profile.firstName} ${profile.lastName}`.trim()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/candidats"
          className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" /> Retour à la CVthèque
        </Link>
        <h1 className="text-2xl font-bold text-fg">{name}</h1>
        <p className="text-sm text-fg-muted">
          {[profile.jobTitleName, profile.city].filter(Boolean).join(' · ')}
        </p>
      </div>
      <CandidateDetailTabs
        active={tab}
        onChange={setTab}
        missionCount={profile.missions.length}
      />
      {tab === 'profil' ? (
        <CandidateProfileForm
          candidateId={profile.id}
          profile={profile}
          referentials={referentials}
        />
      ) : (
        <CandidateMissionsTab
          candidateId={profile.id}
          stages={referentials.pipelineStages}
          missions={profile.missions}
        />
      )}
    </div>
  )
}
