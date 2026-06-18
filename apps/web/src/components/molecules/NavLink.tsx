import Link from 'next/link'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { NavItem } from '@/lib/navigation'

type Props = { item: NavItem; active: boolean; gated?: boolean; expanded?: boolean }

export function NavLink({ item, active, gated = false, expanded = true }: Props) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      title={item.label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center rounded-md py-2 text-sm font-medium transition-colors',
        expanded ? 'gap-3 px-3' : 'justify-center px-0',
        active
          ? 'bg-accent-muted text-accent-hover'
          : 'text-fg-muted hover:bg-surface hover:text-fg',
      )}
    >
      <Icon className="size-5 shrink-0" />
      {expanded ? <span className="truncate">{item.label}</span> : null}
      {gated && expanded ? (
        <Lock aria-hidden="true" className="ml-auto size-4 shrink-0 text-fg-muted" />
      ) : null}
    </Link>
  )
}
