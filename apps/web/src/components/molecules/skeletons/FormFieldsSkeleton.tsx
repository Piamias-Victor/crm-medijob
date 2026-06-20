import { Skeleton } from '@/components/atoms/Skeleton'

type Props = {
  sections?: number
}

export function FormFieldsSkeleton({ sections = 2 }: Props) {
  return (
    <div className="flex flex-col gap-8" aria-hidden>
      <Skeleton className="h-16 w-full rounded-lg" />
      {Array.from({ length: sections }, (_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          <Skeleton className="h-3 w-36" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      ))}
      <Skeleton className="h-10 w-32 rounded-lg" />
    </div>
  )
}
