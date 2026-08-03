import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { HomeAlertGroup as HomeAlertGroupDef } from '@/view-models/home-alerts'

type Props = { group: HomeAlertGroupDef }

export function HomeAlertGroup({ group }: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-white/80 p-3">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={group.href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg hover:text-accent"
        >
          {group.title}
          <ArrowUpRight className="size-3.5 opacity-60" aria-hidden />
        </Link>
        <span className="rounded-full bg-primary-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
          {group.count}
        </span>
      </div>
      {group.items.length === 0 ? (
        <p className="text-xs text-fg-muted">{group.empty}</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {group.items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="block truncate text-sm text-fg-muted transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
