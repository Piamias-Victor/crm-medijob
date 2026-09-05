'use client'

import { type ReactNode } from 'react'
import { CalendarClock } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { InterimNav, type InterimNavCounts } from '@/components/molecules/InterimNav'

type Props = {
  children: ReactNode
  counts: InterimNavCounts
}

export function InterimLayoutShell({ children, counts }: Props) {
  return (
    <DashboardPage
      icon={<CalendarClock className="size-5" />}
      title="Intérim"
      nav={<InterimNav counts={counts} />}
      maxWidth="max-w-[88rem]"
    >
      {children}
    </DashboardPage>
  )
}
