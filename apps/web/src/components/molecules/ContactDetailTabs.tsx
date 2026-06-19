'use client'

import { Briefcase, FileText, History, User } from 'lucide-react'
import { EntityDetailTabs } from '@/components/molecules/EntityDetailTabs'
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
    <EntityDetailTabs
      ariaLabel="Sections fiche contact"
      active={active}
      onChange={onChange}
      tabs={tabs.map((tab) => ({
        ...tab,
        badge: tab.id === 'missions' ? missionCount : undefined,
      }))}
    />
  )
}
