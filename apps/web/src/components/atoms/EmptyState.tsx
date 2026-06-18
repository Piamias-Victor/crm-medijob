import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

type Props = {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white/50 p-10 text-center">
      <span className="mb-3 grid size-12 place-items-center rounded-full bg-surface text-fg-muted">
        <Icon className="size-6" />
      </span>
      <p className="text-base font-semibold text-fg">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-fg-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
