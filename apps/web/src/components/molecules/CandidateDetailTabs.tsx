'use client'

import { Briefcase, ClipboardList, FileText, History, User } from 'lucide-react'
import { EntityDetailTabs } from '@/components/molecules/EntityDetailTabs'

export type CandidateDetailTab = 'profil' | 'historique' | 'missions' | 'entretiens' | 'documents'

const tabs = [
  { id: 'profil' as const, label: 'Profil', icon: User },
  { id: 'historique' as const, label: 'Historique', icon: History },
  { id: 'missions' as const, label: 'Missions', icon: Briefcase },
  { id: 'entretiens' as const, label: 'Entretiens', icon: ClipboardList },
  { id: 'documents' as const, label: 'Documents', icon: FileText },
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
