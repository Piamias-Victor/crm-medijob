'use client'

import { List, Inbox } from 'lucide-react'
import { cn } from '@/lib/cn'

export type CandidatsTab = 'cvtheque' | 'inbox'

const tabs = [
  { id: 'cvtheque', label: 'CVthèque', icon: List },
  { id: 'inbox', label: 'Candidatures reçues', icon: Inbox },
] as const

type Props = {
  active: CandidatsTab
  onChange: (tab: CandidatsTab) => void
  inboxCount: number
}

export function CandidatTabs({ active, onChange, inboxCount }: Props) {
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
          {id === 'inbox' && inboxCount > 0 ? (
            <span className="rounded-full bg-accent-muted px-2 text-xs text-accent-hover">
              {inboxCount}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  )
}
