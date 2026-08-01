import type { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
}

export function QuickViewSection({ title, children }: Props) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</h3>
      <div className="text-sm text-fg">{children}</div>
    </section>
  )
}
