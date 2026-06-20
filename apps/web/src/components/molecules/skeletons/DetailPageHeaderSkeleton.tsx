import { Skeleton } from '@/components/atoms/Skeleton'
import { SURFACE_GLASS_PANEL } from '@/lib/constants/surface-glass'

type Props = {
  chipCount?: number
}

export function DetailPageHeaderSkeleton({ chipCount = 2 }: Props) {
  return (
    <section className={SURFACE_GLASS_PANEL} aria-hidden>
      <header className="border-b border-border/80 bg-gradient-to-r from-primary-muted/55 via-accent-muted/45 to-white px-5 py-4">
        <Skeleton className="h-3 w-24" />
        <div className="mt-4 flex items-start gap-4">
          <Skeleton variant="block" className="size-14 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-8 w-64 max-w-full" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: chipCount }, (_, index) => (
                <Skeleton key={index} className="h-7 w-28 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </header>
    </section>
  )
}
