'use client'

import { Briefcase, FileText, History, User } from 'lucide-react'
import { PillTabs } from '@/components/molecules/PillTabs'
import type { ContactTab } from '@/view-models/contact-tabs'

const tabs = [
  { id: 'infos' as const, label: 'Infos', icon: User },
  { id: 'historique' as const, label: 'Historique', icon: History },
  { id: 'missions' as const, label: 'Missions', icon: Briefcase },
  { id: 'documents' as const, label: 'Documents', icon: FileText },
]

type Props = {
  active: ContactTab
  onChange: (tab: ContactTab) => void
  missionCount: number
}

export function ContactDetailTabs({ active, onChange, missionCount }: Props) {
  return (
    <PillTabs
      aria-label="Sections fiche contact"
      active={active}
      onChange={(id) => onChange(id as ContactTab)}
      items={tabs.map((tab) => ({
        ...tab,
        badge: tab.id === 'missions' ? missionCount : undefined,
      }))}
    />
  )
}
