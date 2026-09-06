import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

type ListRow = { id: string; title: string; subtitle: string; href: string }

type Props = {
  title: string
  count: number
  href: string
  hint: string
  icon: LucideIcon
  rows: ListRow[]
}

export function InterimHomeAlertCard({ title, count, href, hint, icon: Icon, rows }: Props) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border/70 bg-white p-5 shadow-sm">
      <Link href={href} className="flex items-center justify-between gap-3 hover:opacity-90">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent-muted text-accent">
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="text-3xl font-bold tabular-nums text-fg">{count}</span>
      </Link>
      <div>
        <Link href={href} className="text-sm font-semibold text-fg hover:underline">
          {title}
        </Link>
        <p className="mt-1 text-xs text-fg-muted">{hint}</p>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-fg-muted">Aucun élément.</p>
      ) : (
        <ul className="divide-y divide-border/50 border-t border-border/50">
          {rows.map((row) => (
            <li key={row.id}>
              <Link href={row.href} className="block py-2 hover:bg-accent-muted/20">
                <span className="block truncate text-sm font-medium text-fg">{row.title}</span>
                <span className="block truncate text-xs text-fg-muted">{row.subtitle}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
