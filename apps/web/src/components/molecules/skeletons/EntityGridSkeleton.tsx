import { ListCardSkeleton } from '@/components/molecules/skeletons/ListCardSkeleton'
import { cn } from '@/lib/cn'

type Props = {
  count?: number
  className?: string
}

export function EntityGridSkeleton({ count = 6, className }: Props) {
  return (
    <div
      className={cn('grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3', className)}
      aria-hidden
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="h-full">
          <ListCardSkeleton />
        </div>
      ))}
    </div>
  )
}
