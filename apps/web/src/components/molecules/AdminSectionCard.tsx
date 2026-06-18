import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function AdminSectionCard({ title, description, children, className }: Props) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-white shadow-sm',
        className,
      )}
    >
      <header className="border-b border-border bg-gradient-to-r from-accent-muted/70 via-white to-white px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">{description}</p>
        ) : null}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}
