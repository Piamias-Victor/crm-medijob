import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

type Props = {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  variant?: 'default' | 'compact'
}

export function EmptyState({ icon: Icon, title, description, action, variant = 'default' }: Props) {
  const compact = variant === 'compact'

  return (
    <div
      className={
        compact
          ? 'flex items-center gap-2 rounded-lg border border-dashed border-border/60 bg-white/80 px-3 py-2'
          : 'flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white/50 p-10 text-center'
      }
    >
      <span
        className={
          compact
            ? 'grid size-7 shrink-0 place-items-center rounded-full bg-surface text-fg-muted'
            : 'mb-3 grid size-12 place-items-center rounded-full bg-surface text-fg-muted'
        }
      >
        <Icon className={compact ? 'size-3.5' : 'size-6'} />
      </span>
      <div className={compact ? 'min-w-0 text-left' : undefined}>
        <p className={compact ? 'text-xs font-medium text-fg' : 'text-base font-semibold text-fg'}>
          {title}
        </p>
        {description ? (
          <p className={compact ? 'text-xs text-fg-muted' : 'mt-1 max-w-sm text-sm text-fg-muted'}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className={compact ? 'ml-auto' : 'mt-4'}>{action}</div> : null}
    </div>
  )
}
