'use client'

import { Briefcase, History, User } from 'lucide-react'
import { EntityDetailTabs } from '@/components/molecules/EntityDetailTabs'

export type CandidateDetailTab = 'profil' | 'historique' | 'missions'

const tabs = [
  { id: 'profil' as const, label: 'Profil', icon: User },
  { id: 'historique' as const, label: 'Historique', icon: History },
  { id: 'missions' as const, label: 'Missions', icon: Briefcase },
]

type Props = {
  active: CandidateDetailTab
  onChange: (tab: CandidateDetailTab) => void
  missionCount: number
  activityCount: number
}

export function CandidateDetailTabs({ active, onChange, missionCount, activityCount }: Props) {
  return (
    <EntityDetailTabs
      ariaLabel="Sections fiche candidat"
      active={active}
      onChange={onChange}
      tabs={tabs.map((tab) => ({
        ...tab,
        badge:
          tab.id === 'missions' ? missionCount : tab.id === 'historique' ? activityCount : undefined,
      }))}
    />
  )
}
