import { Skeleton } from '@/components/atoms/Skeleton'
import { SkeletonPageShell } from '@/components/molecules/skeletons/SkeletonPageShell'
import { PageHeaderSkeleton } from '@/components/molecules/skeletons/PageHeaderSkeleton'
import { SectionCardSkeleton } from '@/components/molecules/skeletons/SectionCardSkeleton'

function SidebarToolsSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="grid gap-2">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  )
}

function ChatPanelSkeleton() {
  return (
    <div className="flex min-h-[min(70vh,640px)] flex-col" aria-hidden>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 sm:p-5">
        <Skeleton variant="block" className="size-12 rounded-xl" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <div className="border-t border-border/50 bg-white/50 p-4 backdrop-blur-sm sm:px-5">
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  )
}

export function AssistantPageSkeleton() {
  return (
    <SkeletonPageShell label="Chargement de l'assistant">
      <PageHeaderSkeleton />
      <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr]">
        <SectionCardSkeleton bodyClassName="space-y-5 p-4 sm:p-5">
          <SidebarToolsSkeleton />
        </SectionCardSkeleton>
        <SectionCardSkeleton bodyClassName="p-0">
          <ChatPanelSkeleton />
        </SectionCardSkeleton>
      </div>
    </SkeletonPageShell>
  )
}
