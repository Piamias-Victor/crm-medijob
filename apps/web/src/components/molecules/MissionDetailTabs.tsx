'use client'

import { Briefcase, FileText, GitBranch, History, Sparkles, Info } from 'lucide-react'
import { EntityDetailTabs } from '@/components/molecules/EntityDetailTabs'
import type { MissionTab } from '@/view-models/mission-tabs'

const tabs = [
  { id: 'infos' as const, label: 'Infos', icon: Info },
  { id: 'pipeline' as const, label: 'Pipeline', icon: GitBranch },
  { id: 'matching' as const, label: 'Matching', icon: Sparkles },
  { id: 'offre' as const, label: 'Offre', icon: Briefcase },
  { id: 'historique' as const, label: 'Historique', icon: History },
  { id: 'documents' as const, label: 'Documents', icon: FileText },
]

type Props = {
  active: MissionTab
  onChange: (tab: MissionTab) => void
}

export function MissionDetailTabs({ active, onChange }: Props) {
  return (
    <EntityDetailTabs
      ariaLabel="Sections fiche mission"
      active={active}
      onChange={onChange}
      tabs={tabs}
    />
  )
}
