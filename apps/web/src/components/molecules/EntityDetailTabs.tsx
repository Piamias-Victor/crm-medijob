'use client'

import { type LucideIcon } from 'lucide-react'
import { PillTabs } from '@/components/molecules/PillTabs'

export type EntityTabItem<T extends string> = {
  id: T
  label: string
  icon: LucideIcon
  badge?: number
}

type Props<T extends string> = {
  ariaLabel: string
  active: T
  onChange: (tab: T) => void
  tabs: EntityTabItem<T>[]
}

export function EntityDetailTabs<T extends string>({ ariaLabel, active, onChange, tabs }: Props<T>) {
  return (
    <PillTabs
      aria-label={ariaLabel}
      active={active}
      onChange={(id) => onChange(id as T)}
      items={tabs}
    />
  )
}
