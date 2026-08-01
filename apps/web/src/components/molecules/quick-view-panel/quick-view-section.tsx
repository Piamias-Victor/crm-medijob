import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  title: string
  icon?: LucideIcon
  children: ReactNode
}

export function QuickViewSection({ title, icon: Icon, children }: Props) {
  return (
    <section className="space-y-3 rounded-xl border border-border/70 bg-gradient-to-br from-surface via-surface to-primary-muted/25 p-3.5 shadow-sm shadow-black/[0.02]">
      <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
        {Icon ? <Icon className="size-3.5 shrink-0 text-accent" aria-hidden /> : null}
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  )
}
