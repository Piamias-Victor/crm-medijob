'use client'

import { LayoutGrid, List, Map as MapIcon, Table2, type LucideIcon } from 'lucide-react'
import { PillTabs } from '@/components/molecules/PillTabs'

export type ListKanbanView = 'list' | 'kanban'
export type MissionView = 'list' | 'kanban' | 'map'
export type CvthequeView = 'table' | 'kanban' | 'map'
export type PharmacyView = 'list' | 'map'

export type ViewToggleItem<T extends string> = {
  id: T
  label: string
  icon: LucideIcon
}

export const missionViewOptions: ViewToggleItem<MissionView>[] = [
  { id: 'list', label: 'Liste', icon: List },
  { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
  { id: 'map', label: 'Carte', icon: MapIcon },
]

export const cvthequeViewOptions: ViewToggleItem<CvthequeView>[] = [
  { id: 'table', label: 'Tableau', icon: Table2 },
  { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
  { id: 'map', label: 'Carte', icon: MapIcon },
]

export const pharmacyViewOptions: ViewToggleItem<PharmacyView>[] = [
  { id: 'list', label: 'Liste', icon: List },
  { id: 'map', label: 'Carte', icon: MapIcon },
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
