import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  icon: ReactNode
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({ icon, title, description, children, className }: Props) {
  return (
    <header
      className={cn(
        'rounded-xl border border-border bg-gradient-to-br from-primary-muted/50 via-surface to-accent-muted/40 p-6 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg shadow-md shadow-accent/30">
          {icon}
        </span>
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-fg">{title}</h1>
            {description ? <p className="text-sm text-fg-muted">{description}</p> : null}
          </div>
          {children}
        </div>
      </div>
    </header>
  )
}
