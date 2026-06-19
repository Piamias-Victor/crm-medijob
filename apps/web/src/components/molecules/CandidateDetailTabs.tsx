'use client'

import { Briefcase, History, User } from 'lucide-react'
import { PillTabs } from '@/components/molecules/PillTabs'

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
    <PillTabs
      aria-label="Sections fiche candidat"
      active={active}
      onChange={(id) => onChange(id as CandidateDetailTab)}
      items={tabs.map((tab) => ({
        ...tab,
        badge:
          tab.id === 'missions' ? missionCount : tab.id === 'historique' ? activityCount : undefined,
      }))}
    />
  )
}
