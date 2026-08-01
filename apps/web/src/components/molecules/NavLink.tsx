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
        'flex h-9 items-center rounded-md text-sm font-medium transition-[color,background-color,gap,padding] duration-300 ease-out',
        expanded ? 'gap-3 px-3' : 'justify-center gap-0 px-0',
        active
          ? 'bg-accent-muted text-accent-hover'
          : 'text-fg-muted hover:bg-surface hover:text-fg',
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span
        className={cn(
          'truncate transition-opacity duration-300 ease-out',
          expanded ? 'opacity-100' : 'w-0 overflow-hidden opacity-0',
        )}
      >
        {item.label}
      </span>
      {gated ? (
        <Lock
          aria-hidden="true"
          className={cn(
            'ml-auto size-4 shrink-0 text-fg-muted transition-opacity duration-300',
            expanded ? 'opacity-100' : 'w-0 overflow-hidden opacity-0',
          )}
        />
      ) : null}
    </Link>
  )
}
