'use client'

import { List, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/cn'

export type CvView = 'list' | 'kanban'

const options = [
  { id: 'list', label: 'Liste', icon: List },
  { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
] as const

type Props = { view: CvView; onChange: (view: CvView) => void }

export function ViewToggle({ view, onChange }: Props) {
  return (
    <div className="inline-flex rounded-md border border-border bg-white p-0.5">
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={view === id}
          onClick={() => onChange(id)}
          className={cn(
            'flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors',
            view === id
              ? 'bg-accent-muted text-accent-hover'
              : 'text-fg-muted hover:text-fg',
          )}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
