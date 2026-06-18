'use client'

import { User, Briefcase } from 'lucide-react'
import { cn } from '@/lib/cn'

export type CandidateDetailTab = 'profil' | 'missions'

const tabs = [
  { id: 'profil', label: 'Profil', icon: User },
  { id: 'missions', label: 'Missions', icon: Briefcase },
] as const

type Props = {
  active: CandidateDetailTab
  onChange: (tab: CandidateDetailTab) => void
  missionCount: number
}

export function CandidateDetailTabs({ active, onChange, missionCount }: Props) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-border">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          onClick={() => onChange(id)}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
            active === id
              ? 'border-accent text-accent-hover'
              : 'border-transparent text-fg-muted hover:text-fg',
          )}
        >
          <Icon className="size-4" />
          {label}
          {id === 'missions' && missionCount > 0 ? (
            <span className="rounded-full bg-accent-muted px-2 text-xs text-accent-hover">
              {missionCount}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  )
}
