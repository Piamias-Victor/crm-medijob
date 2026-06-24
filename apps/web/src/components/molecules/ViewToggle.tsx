'use client'

import { LayoutGrid, List, Table2, type LucideIcon } from 'lucide-react'
import { PillTabs } from '@/components/molecules/PillTabs'

export type ListKanbanView = 'list' | 'kanban'
export type CvthequeView = 'table' | 'kanban'

export type ViewToggleItem<T extends string> = {
  id: T
  label: string
  icon: LucideIcon
}

export const missionViewOptions: ViewToggleItem<ListKanbanView>[] = [
  { id: 'list', label: 'Liste', icon: List },
  { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
]

export const cvthequeViewOptions: ViewToggleItem<CvthequeView>[] = [
  { id: 'table', label: 'Tableau', icon: Table2 },
  { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
]

type Props<T extends string> = {
  view: T
  onChange: (view: T) => void
  items: ViewToggleItem<T>[]
}

export function ViewToggle<T extends string>({ view, onChange, items }: Props<T>) {
  return (
    <PillTabs
      aria-label="Mode d'affichage"
      active={view}
      onChange={(id) => onChange(id as T)}
      items={items}
    />
  )
}
