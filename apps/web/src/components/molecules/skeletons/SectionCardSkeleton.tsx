import { type ReactNode } from 'react'
import { Skeleton } from '@/components/atoms/Skeleton'
import { SURFACE_GLASS_PANEL } from '@/lib/constants/surface-glass'
import { cn } from '@/lib/cn'

type ActionKind = 'toggle' | 'button'

type Props = {
  action?: ActionKind
  bodyClassName?: string
  children: ReactNode
  className?: string
}

function SectionCardActionSkeleton({ action }: { action: ActionKind }) {
  if (action === 'toggle') {
    return (
      <div className="flex shrink-0 gap-2">
        <Skeleton className="h-[38px] w-20 rounded-full" />
        <Skeleton className="h-[38px] w-24 rounded-full" />
      </div>
    )
  }

  return <Skeleton className="h-10 w-44 shrink-0 rounded-lg" />
}

export function SectionCardSkeleton({
  action,
  bodyClassName,
  children,
  className,
}: Props) {
  return (
    <section className={cn(SURFACE_GLASS_PANEL, className)} aria-hidden>
      <header className="flex flex-col gap-3 border-b border-border/80 bg-gradient-to-r from-accent-muted/70 via-white to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        {action ? <SectionCardActionSkeleton action={action} /> : null}
      </header>
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  )
}
