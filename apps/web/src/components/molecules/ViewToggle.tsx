'use client'

import { LayoutGrid, List } from 'lucide-react'
import { PillTabs } from '@/components/molecules/PillTabs'

export type CvView = 'list' | 'kanban'

const options = [
  { id: 'list' as const, label: 'Liste', icon: List },
  { id: 'kanban' as const, label: 'Kanban', icon: LayoutGrid },
]

type Props = { view: CvView; onChange: (view: CvView) => void }

export function ViewToggle({ view, onChange }: Props) {
  return (
    <PillTabs
      aria-label="Mode d'affichage"
      active={view}
      onChange={(id) => onChange(id as CvView)}
      items={options}
    />
  )
}
