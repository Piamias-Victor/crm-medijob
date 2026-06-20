import { Skeleton } from '@/components/atoms/Skeleton'
import { cn } from '@/lib/cn'

type Props = {
  widths: string[]
  className?: string
}

export function PillTabsSkeleton({ widths, className }: Props) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} aria-hidden>
      {widths.map((width, index) => (
        <Skeleton key={index} className={cn('h-[38px] rounded-full', width)} />
      ))}
    </div>
  )
}
