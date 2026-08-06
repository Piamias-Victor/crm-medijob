'use client'

import { Inbox, List, Smartphone } from 'lucide-react'
import { PillTabs } from '@/components/molecules/PillTabs'
import type { CandidatsTab } from '@/view-models/candidats-tab'

export type { CandidatsTab }

const tabs = [
  { id: 'cvtheque' as const, label: 'CVthèque', icon: List },
  { id: 'inbox' as const, label: 'Candidatures reçues', icon: Inbox },
  { id: 'app-profiles' as const, label: 'Profils app', icon: Smartphone },
]

type Props = {
  active: CandidatsTab
  onChange: (tab: CandidatsTab) => void
  inboxCount: number
  appProfileCount: number
}

export function CandidatTabs({ active, onChange, inboxCount, appProfileCount }: Props) {
  return (
    <PillTabs
      aria-label="Sections candidats"
      active={active}
      onChange={(id) => onChange(id as CandidatsTab)}
      items={tabs.map((tab) => ({
        ...tab,
        badge:
          tab.id === 'inbox' ? inboxCount : tab.id === 'app-profiles' ? appProfileCount : undefined,
      }))}
    />
  )
}
