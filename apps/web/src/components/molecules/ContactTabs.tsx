'use client'

import { FileText, Briefcase, History, User } from 'lucide-react'
import { cn } from '@/lib/cn'
import { adminNavLinkClass } from '@/view-models/admin-nav-link'

export type ContactTab = 'infos' | 'historique' | 'missions' | 'documents'

const tabs = [
  { id: 'infos', label: 'Infos', icon: User },
  { id: 'historique', label: 'Historique', icon: History },
  { id: 'missions', label: 'Missions', icon: Briefcase },
  { id: 'documents', label: 'Documents', icon: FileText },
] as const

type Props = {
  active: ContactTab
  onChange: (tab: ContactTab) => void
  missionCount: number
}

export function ContactTabs({ active, onChange, missionCount }: Props) {
  return (
    <nav role="tablist" className="flex flex-wrap gap-2">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          onClick={() => onChange(id)}
          className={cn(adminNavLinkClass(active === id), 'inline-flex items-center gap-2')}
        >
          <Icon className="size-4" />
          {label}
          {id === 'missions' && missionCount > 0 ? (
            <span className="rounded-full bg-white/25 px-2 text-xs">{missionCount}</span>
          ) : null}
        </button>
      ))}
    </nav>
  )
}
