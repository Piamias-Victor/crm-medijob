'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  missionId: string
  title: string
  subtitle: string
  meta?: string
  trailing?: ReactNode
}

export function EntityLinkedMissionRow({ missionId, title, subtitle, meta, trailing }: Props) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push(`/missions/${missionId}`)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/55 bg-white/88 px-4 py-3 text-left text-sm shadow-sm transition-all hover:border-accent/45 hover:shadow-md hover:shadow-accent/8"
    >
      <div className="min-w-0">
        <p className="font-medium text-fg">{title}</p>
        <p className="text-fg-muted">{subtitle}</p>
        {meta ? <p className="text-xs text-fg-muted">{meta}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {trailing}
        <ChevronRight className="size-4 text-fg-muted" aria-hidden />
      </div>
    </button>
  )
}
