'use client'

import { Briefcase, FileText, History, Info, Users } from 'lucide-react'
import { PillTabs } from '@/components/molecules/PillTabs'
import type { PharmacyTab } from '@/view-models/pharmacy-tabs'

const tabs = [
  { id: 'infos' as const, label: 'Infos', icon: Info },
  { id: 'contacts' as const, label: 'Contacts', icon: Users },
  { id: 'besoins' as const, label: 'Besoins en cours', icon: Briefcase },
  { id: 'historique' as const, label: 'Historique', icon: History },
  { id: 'documents' as const, label: 'Documents', icon: FileText },
]

type Props = {
  active: PharmacyTab
  onChange: (tab: PharmacyTab) => void
  contactCount: number
  missionCount: number
}

export function PharmacyDetailTabs({ active, onChange, contactCount, missionCount }: Props) {
  return (
    <PillTabs
      aria-label="Sections fiche pharmacie"
      active={active}
      onChange={(id) => onChange(id as PharmacyTab)}
      items={tabs.map((tab) => ({
        ...tab,
        badge:
          tab.id === 'contacts' ? contactCount : tab.id === 'besoins' ? missionCount : undefined,
      }))}
    />
  )
}
