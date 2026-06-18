'use client'

import { Briefcase, User } from 'lucide-react'
import { PillTabs } from '@/components/molecules/PillTabs'

export type CandidateDetailTab = 'profil' | 'missions'

const tabs = [
  { id: 'profil' as const, label: 'Profil', icon: User },
  { id: 'missions' as const, label: 'Missions', icon: Briefcase },
]

type Props = {
  active: CandidateDetailTab
  onChange: (tab: CandidateDetailTab) => void
  missionCount: number
}

export function CandidateDetailTabs({ active, onChange, missionCount }: Props) {
  return (
    <PillTabs
      aria-label="Sections fiche candidat"
      active={active}
      onChange={(id) => onChange(id as CandidateDetailTab)}
      items={tabs.map((tab) => ({
        ...tab,
        badge: tab.id === 'missions' ? missionCount : undefined,
      }))}
    />
  )
}
