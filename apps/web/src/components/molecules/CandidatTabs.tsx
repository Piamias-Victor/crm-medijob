'use client'

import { Inbox, List } from 'lucide-react'
import { PillTabs } from '@/components/molecules/PillTabs'
import { CANDIDAT_TAB_ITEMS, type CandidatsTab } from '@/view-models/candidats-tab'

export type { CandidatsTab }

const icons = { cvtheque: List, inbox: Inbox } as const

type Props = {
  active: CandidatsTab
  onChange: (tab: CandidatsTab) => void
  inboxCount: number
}

export function CandidatTabs({ active, onChange, inboxCount }: Props) {
  return (
    <PillTabs
      aria-label="Sections candidats"
      active={active}
      onChange={(id) => onChange(id as CandidatsTab)}
      items={CANDIDAT_TAB_ITEMS.map((tab) => ({
        ...tab,
        icon: icons[tab.id],
        badge: tab.id === 'inbox' ? inboxCount : undefined,
      }))}
    />
  )
}
