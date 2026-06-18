'use client'

import { type LucideIcon } from 'lucide-react'
import { pillNavLinkClass } from '@/view-models/pill-nav-link'
import { cn } from '@/lib/cn'

export type PillTabItem = {
  id: string
  label: string
  icon?: LucideIcon
  badge?: number
}

type Props = {
  items: PillTabItem[]
  active: string
  onChange: (id: string) => void
  className?: string
  'aria-label'?: string
}

export function PillTabs({ items, active, onChange, className, 'aria-label': ariaLabel }: Props) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={cn('flex flex-wrap gap-2', className)}>
      {items.map(({ id, label, icon: Icon, badge }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={cn(pillNavLinkClass(isActive), 'inline-flex items-center gap-2')}
          >
            {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
            {label}
            {badge != null && badge > 0 ? (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
                  isActive ? 'bg-white/20 text-accent-fg' : 'bg-accent-muted text-accent-hover',
                )}
              >
                {badge}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
