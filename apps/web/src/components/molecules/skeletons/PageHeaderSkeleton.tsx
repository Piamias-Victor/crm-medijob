import { type ReactNode } from 'react'
import { Skeleton } from '@/components/atoms/Skeleton'
import { cn } from '@/lib/cn'

type Props = {
  showDescription?: boolean
  nav?: ReactNode
  className?: string
}

export function PageHeaderSkeleton({ showDescription = true, nav, className }: Props) {
  return (
    <header
      className={cn(
        'rounded-xl border border-border bg-gradient-to-br from-primary-muted/50 via-white to-accent-muted/40 p-6 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <Skeleton variant="block" className="size-11 shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            {showDescription ? <Skeleton className="h-4 w-56 max-w-full" /> : null}
          </div>
          {nav}
        </div>
      </div>
    </header>
  )
}
