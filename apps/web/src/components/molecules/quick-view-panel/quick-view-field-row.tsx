import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  icon: LucideIcon
  children: ReactNode
}

export function QuickViewFieldRow({ icon: Icon, children }: Props) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-fg">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-muted/60 text-primary">
        <Icon className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 break-words leading-snug">{children}</div>
    </div>
  )
}
