import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { SURFACE_GLASS_PANEL } from '@/lib/constants/surface-glass'

type Variant = 'default' | 'glass'

type Props = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  embedded?: boolean
  variant?: Variant
  bodyClassName?: string
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  embedded,
  variant = 'default',
  bodyClassName,
}: Props) {
  const header = (
    <header className="flex flex-col gap-3 border-b border-border/80 bg-gradient-to-r from-accent-muted/70 via-white to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  )
  const body = <div className={cn('p-5', bodyClassName)}>{children}</div>

  if (embedded) {
    return (
      <div className={className}>
        {header}
        {body}
      </div>
    )
  }

  return (
    <section
      className={cn(
        variant === 'glass' ? SURFACE_GLASS_PANEL : 'rounded-xl border border-border bg-white shadow-sm',
        className,
      )}
    >
      {header}
      {body}
    </section>
  )
}
