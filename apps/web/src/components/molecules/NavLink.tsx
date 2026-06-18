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
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-accent-muted text-accent-hover'
          : 'text-fg-muted hover:bg-surface hover:text-fg',
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span
        aria-hidden={!expanded}
        className={cn(
          'overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-out',
          expanded ? 'max-w-40 opacity-100' : 'max-w-0 opacity-0',
        )}
      >
        {item.label}
      </span>
      {gated ? (
        <Lock
          aria-hidden="true"
          className={cn(
            'ml-auto size-4 shrink-0 text-fg-muted transition-opacity duration-200',
            expanded ? 'opacity-100' : 'opacity-0',
          )}
        />
      ) : null}
    </Link>
  )
}
